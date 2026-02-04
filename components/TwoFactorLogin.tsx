import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { loginWithTwoFactor } from "@/graphql/auth";
import { startTwoFactorSetup } from "@/graphql/2fa";
import useAuthStore from "@/store/useAuthStore";
import { getErrMsg } from "@/util/initData";
import {
  Shield,
  Key,
  AlertCircle,
  Copy,
  CheckCircle,
} from "lucide-react";

interface TwoFactorLoginProps {
  twoFactorToken: string;
  onBack: () => void;
}

const TwoFactorLogin: React.FC<TwoFactorLoginProps> = ({
  twoFactorToken,
  onBack,
}) => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [useBackupCode, setUseBackupCode] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [generatingQR, setGeneratingQR] = useState<boolean>(false);

  const handleSubmit = async () => {

    if (!code.trim()) {
      toast.error("Please enter a code");
      return;
    }
    setLoading(true);
    try {
      const res: any = await loginWithTwoFactor(code.trim(), twoFactorToken);
      if (res.data?.loginWithTwoFactor?.accessToken) {
        // Store the final token only after successful 2FA
        setToken(res.data.loginWithTwoFactor.accessToken);
        toast.success("Login successful!");
        navigate("/", { replace: true });
      } else {
        throw new Error("Invalid authentication code");
      }
    } catch (err) {
      const errorMsg = getErrMsg(err, "message");
      toast.error(errorMsg || "Invalid code. Please try again.");
      setCode(""); // Clear the code on error
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (useBackupCode) {
      // For backup codes, allow alphanumeric and limit to 10 characters
      if (value.length <= 10) {
        setCode(value);
      }
    } else {
      // For authenticator codes, only numbers and limit to 6 digits
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 6) {
        setCode(numericValue);
      }
    }
  };


  //don't remove
  // const generateQRCode = async () => {
  //   if (generatingQR) return; 

  //   setGeneratingQR(true);

  //   try {
  //     const res: any = await startTwoFactorSetup();
  //     console.log(res,"09")
  //     const otpauthUrl = res.data?.startTwoFactorSetup?.otpauthUrl;

  //     if (!otpauthUrl) throw new Error("No QR data returned");

  //     setQrCodeUrl(otpauthUrl);
  //     setShowQRCode(true);
  //     toast.success("QR Code generated successfully");
  //   } catch (err) {
  //     toast.error(getErrMsg(err, "message") || "Failed to generate QR code");
  //   } finally {
  //     setGeneratingQR(false);
  //   }
  // };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Form */}
      <div className="fixed bottom-50 right-50 z-10 w-full max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Shield className="text-indigo-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              TWO-FACTOR AUTHENTICATION
            </h1>
            <p className="text-sm text-gray-500">
              {useBackupCode
                ? "Enter one of your backup codes"
                : showQRCode
                ? "Scan the QR code with your authenticator app"
                : "Enter the code from your authenticator app"}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Code Input */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">
                {useBackupCode
                  ? "Backup Code"
                  : showQRCode
                  ? "Scan QR Code"
                  : "Authentication Code"}
              </Label>
              {showQRCode ? (
                <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="bg-white p-2 rounded-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        qrCodeUrl
                      )}`}
                      alt="2FA QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Scan this QR code with your authenticator app
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                        {qrCodeUrl.split("secret=")[1]?.split("&")[0] ||
                          "Loading..."}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const secret = qrCodeUrl
                            .split("secret=")[1]
                            ?.split("&")[0];
                          if (secret) {
                            navigator.clipboard.writeText(secret);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                        disabled={!qrCodeUrl}
                      >
                        {copied ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Can't scan? Copy the code above and enter manually
                    </p>
                  </div>
                </div>
              ) : (
                <Input
                  id="code"
                  type="text"
                  inputMode={useBackupCode ? "text" : "numeric"}
                  value={code}
                  onChange={handleCodeChange}
                  placeholder={
                    useBackupCode
                      ? "Enter 10-character backup code"
                      : "Enter 6-digit code"
                  }
                  className="text-center text-lg font-mono tracking-widest"
                  autoFocus
                  disabled={loading}
                />
              )}
              <p className="text-xs text-gray-500 text-center">
                {useBackupCode
                  ? "Enter your 10-character backup code (each can only be used once)"
                  : showQRCode
                  ? "Scan the QR code above with your authenticator app, then enter the generated code below"
                  : "Open your authenticator app to get the current 6-digit code"}
              </p>
            </div>

            {/* Info Card */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">
                      {useBackupCode
                        ? "Using Backup Code"
                        : "Using Authenticator App"}
                    </p>
                    <p>
                      {useBackupCode
                        ? "Enter one of your 10-character backup codes saved during 2FA setup"
                        : showQRCode
                        ? "Scan the QR code with your authenticator app to generate a code"
                        : "Enter the 6-digit code generated by your authenticator app"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Toggle between methods */}
            <div className="space-y-3">
            {/* //don't remove */}
              {/* {!useBackupCode && !showQRCode && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={generateQRCode}
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    disabled={loading || generatingQR}
                  >
                    {generatingQR ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Generating QR...
                      </>
                    ) : (
                      <>
                        <QrCode size={16} />
                        Generate QR Code
                      </>
                    )}
                  </button>
                </div>
              )} */}

              {!useBackupCode && showQRCode && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQRCode(false);
                      setQrCodeUrl("");
                      setCode("");
                    }}
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    disabled={loading}
                  >
                    <Key size={16} />
                    Enter Code Manually
                  </button>
                </div>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(!useBackupCode);
                    setShowQRCode(false);
                    setCode("");
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  disabled={loading}
                >
                  {useBackupCode
                    ? "← Use Authenticator App Instead"
                    : "Can't access your app? Use Backup Code →"}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {/* <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
                className="flex-1"
              >
                Back to Login
              </Button> */}
              <Button
                type="submit"
                disabled={
                  loading ||
                  !code.trim() ||
                  (useBackupCode
                    ? code.length < 10
                    : showQRCode
                    ? false
                    : code.length !== 6)
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify & Login"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorLogin;
