import React, { useState } from "react";
import { 
  Shield, 
  QrCode, 
  Key, 
  Download, 
  Copy, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  startTwoFactorSetup, 
  confirmTwoFactorSetup, 
  disableTwoFactor 
} from "@/graphql/2fa";
import { useUser } from "@/provider/UserProvider";

interface TwoFactorAuthProps {
  onClose: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onClose }) => {
  const { user, setUser } = useUser();
  const [step, setStep] = useState<'setup' | 'qr' | 'confirm' | 'backup' | 'disable' | 'disable-qr' | 'disable-confirm'>(
    user?.twoFactorEnabled ? 'disable-confirm' : 'setup'
  );
  const [otpauthUrl, setOtpauthUrl] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Start 2FA setup process
  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const res: any = await startTwoFactorSetup();
      const url = res.data?.startTwoFactorSetup?.otpauthUrl;
      if (url) {
        setOtpauthUrl(url);
        setStep('qr');
        toast.success("2FA setup started successfully");
      } else {
        throw new Error("Failed to get QR code");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  // Confirm 2FA setup with code from authenticator app
  const handleConfirmSetup = async () => {
    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res: any = await confirmTwoFactorSetup(code);
      const codes = res.data?.confirmTwoFactorSetup?.backupCodes;
      if (codes && Array.isArray(codes)) {
        setBackupCodes(codes);
        setStep('backup');
        // Update user state to reflect 2FA enabled
        if (user) {
          setUser({
            ...user,
            twoFactorEnabled: true,
            twoFactorConfirmedAt: new Date().toISOString()
          });
        }
        toast.success("Two-factor authentication enabled successfully!");
      } else {
        throw new Error("Failed to confirm 2FA setup");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Start 2FA setup for disable process (when user lost access)
  const handleStartDisableSetup = async () => {
    setLoading(true);
    try {
      const res: any = await startTwoFactorSetup();
      const url = res.data?.startTwoFactorSetup?.otpauthUrl;
      if (url) {
        setOtpauthUrl(url);
        setStep('disable-qr');
        toast.success("New QR code generated for disable process");
      } else {
        throw new Error("Failed to generate QR code");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate new QR code");
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const handleDisableTwoFactor = async () => {
    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res: any = await disableTwoFactor(code);
      if (res.data?.disableTwoFactor === true) {
        // Update user state to reflect 2FA disabled
        if (user) {
          setUser({
            ...user,
            twoFactorEnabled: false,
            twoFactorConfirmedAt: ""
          });
        }
        toast.success("Two-factor authentication disabled successfully");
        onClose();
      } else {
        throw new Error("Failed to disable 2FA");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle disable flow - either use existing code or generate new QR
  const handleDisableFlow = () => {
    setStep('disable-confirm'); // Go directly to code entry
  };

  // Handle regenerate QR code for disable
  const handleRegenerateQR = () => {
    setCode('');
    handleStartDisableSetup();
  };

  // Copy backup codes to clipboard
  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopied(true);
    toast.success("Backup codes copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Download backup codes as text file
  const downloadBackupCodes = () => {
    const codesText = `Two-Factor Authentication Backup Codes

${backupCodes.join('\n')}
')}

Store these codes in a secure location. Each code can only be used once.`;
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup codes downloaded");
  };

  // Render setup step
  if (step === 'setup') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="text-indigo-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Enable Two-Factor Authentication</h3>
          <p className="text-gray-500">
            Add an extra layer of security to your account by requiring a code from your authenticator app.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Before you start:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Download Google Authenticator or any TOTP app</li>
                <li>Ensure you have a stable internet connection</li>
                <li>Have a secure place to store backup codes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartSetup}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Setting up..." : "Start Setup"}
          </Button>
        </div>
      </div>
    );
  }

  // Render QR code step
  if (step === 'qr') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Scan QR Code</h3>
          <p className="text-gray-500">
            Scan this QR code with your authenticator app to link it to your account.
          </p>
        </div>

        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-8 flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`}
                alt="2FA QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Can't scan? Enter this key manually: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{otpauthUrl.split('secret=')[1]?.split('&')[0]}</span>
            </p>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-500 mt-0.5 flex-shrink-0" size={18} />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Next steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                <li>Open your authenticator app</li>
                <li>Scan the QR code above</li>
                <li>Enter the 6-digit code generated by the app</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setStep('setup')}
          >
            Back
          </Button>
          <Button
            onClick={() => setStep('confirm')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Render confirmation step
  if (step === 'confirm') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Setup</h3>
          <p className="text-gray-500">
            Enter the 6-digit code from your authenticator app to complete setup.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Authentication Code
          </Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCode(value);
            }}
            placeholder="Enter 6-digit code"
            className="text-center text-lg font-mono tracking-widest"
          />
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setStep('qr');
              setCode('');
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleConfirmSetup}
            disabled={loading || code.length !== 6}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Verifying..." : "Verify & Enable"}
          </Button>
        </div>
      </div>
    );
  }

  // Render backup codes step
  if (step === 'backup') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Setup Complete!</h3>
          <p className="text-gray-500">
            Save these backup codes in a secure location. You'll need them if you lose access to your authenticator app.
          </p>
        </div>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle size={20} />
              Important Security Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-red-700 space-y-2 text-sm">
              <li>• Each backup code can only be used once</li>
              <li>• Store these codes securely (password manager, safe, etc.)</li>
              <li>• Do not share these codes with anyone</li>
              <li>• Treat these codes like passwords</li>
            </ul>
          </CardContent>
        </Card>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Your Backup Codes</h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyBackupCodes}
                className="h-8"
              >
                {copied ? (
                  <>
                    <CheckCircle size={14} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} className="mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadBackupCodes}
                className="h-8"
              >
                <Download size={14} className="mr-1" />
                Download
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, index) => (
              <div 
                key={index}
                className="font-mono text-center py-2 px-3 bg-white border rounded text-sm"
              >
                {code}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  // Render initial disable step
  if (step === 'disable') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="text-red-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Disable Two-Factor Authentication</h3>
          <p className="text-gray-500">
            You can disable 2FA using your current authenticator app or generate a new QR code if you've lost access.
          </p>
        </div>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Warning:</p>
                <p>Your account will be less secure without two-factor authentication. Only disable it if absolutely necessary.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={handleDisableFlow}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Use Current Authenticator App
          </Button>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <Button
            onClick={handleRegenerateQR}
            disabled={loading}
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-50"
          >
            {loading ? "Generating QR Code..." : "Generate New QR Code"}
          </Button>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Render disable QR code step
  if (step === 'disable-qr') {
    return (
      <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Scan New QR Code</h3>
        <p className="text-gray-500">
          Scan this QR code with your authenticator app to generate a code for disabling 2FA.
        </p>
      </div>

      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg border">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`}
              alt="2FA QR Code"
              className="w-48 h-48"
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Can't scan? Enter this key manually: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{otpauthUrl.split('secret=')[1]?.split('&')[0]}</span>
          </p>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-yellow-500 mt-0.5 flex-shrink-0" size={18} />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-yellow-700">
              <li>Open your authenticator app</li>
              <li>Scan the QR code above</li>
              <li>Enter the 6-digit code to disable 2FA</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => setStep('disable')}
        >
          Back
        </Button>
        <Button
          onClick={() => setStep('disable-confirm')}
          className="bg-red-600 hover:bg-red-700"
        >
          Continue to Disable
        </Button>
      </div>
    </div>
    );
  }

  // Render disable confirmation step
  if (step === 'disable-confirm') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Disable Two-Factor Authentication</h3>
          <p className="text-gray-500">
            Enter the 6-digit code from your authenticator app to disable 2FA.
          </p>
        </div>

        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Final Warning:</p>
                <p>After disabling, your account will no longer require two-factor authentication for login.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Label htmlFor="disable-code" className="text-sm font-medium">
            Authentication Code
          </Label>
          <Input
            id="disable-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCode(value);
            }}
            placeholder="Enter 6-digit code"
            className="text-center text-lg font-mono tracking-widest"
          />
        </div>

        <div className="flex justify-between gap-3 pt-4">
          {/* <Button
            variant="outline"
            onClick={() => setStep('disable')}
          >
            Back to Options
          </Button> */}
          <Button
            onClick={handleDisableTwoFactor}
            disabled={loading || code.length !== 6}
            variant="outline"
          >
            {loading ? "Disabling..." : "Disable 2FA"}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default TwoFactorAuth;