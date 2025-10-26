"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  feature?: string;
}

/**
 * Component that guards protected features and shows a login prompt for unauthenticated users.
 */
export function AuthGuard({
  children,
  title = "Authentication Required",
  description = "Please log in to access this advanced feature.",
  feature,
}: AuthGuardProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="w-full">
      {children ? (
        children
      ) : (
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-muted rounded-full">
                <Lock className="size-6 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {feature
                ? `${description} Access to ${feature} requires authentication.`
                : description}
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={handleLogin} className="w-full sm:w-auto">
              <LogIn className="size-4 mr-2" />
              Login to Access
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
