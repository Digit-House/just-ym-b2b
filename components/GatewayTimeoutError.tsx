import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface GatewayTimeoutErrorProps {
  onRetry?: () => void;
  message?: string;
}

export const GatewayTimeoutError = ({ onRetry, message }: GatewayTimeoutErrorProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <span className="text-destructive font-bold text-xl">504</span>
          </div>
          <CardTitle className="text-xl">Gateway Timeout</CardTitle>
          <CardDescription>
            {message || "The server didn't respond in time. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            This usually happens when the server is temporarily overloaded or there's a network issue.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GatewayTimeoutError;