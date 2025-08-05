import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { AlertTriangle, Home, LogIn, ShieldX } from "lucide-react";

export const metadata: Metadata = {
  title: "Error",
  description: "Error",
};

const ErrorPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { error, message } = await searchParams;

  console.log("error", error);
  if (error === "AccessDenied") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 border border-border">
          <div className="text-center space-y-6">
            <div className="mx-auto size-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <ShieldX className="size-8 text-destructive" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                Access Denied
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                You are not authorized to access this page. Please contact
                support if you believe this is an error.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild variant="outline" className="flex-1">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login Again
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 border border-border">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-accent-foreground" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              An error occurred while trying to process your request. Please try
              again or contact support if the problem persists.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login Again
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
