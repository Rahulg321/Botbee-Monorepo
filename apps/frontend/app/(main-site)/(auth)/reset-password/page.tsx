"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/buttons/submit-button";

import {
  login,
  ResetPasswordActionState,
  resetPassword,
  type LoginActionState,
} from "@/lib/actions";
import { useSession } from "next-auth/react";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<
    ResetPasswordActionState,
    FormData
  >(resetPassword, {
    status: "idle",
  });

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials!");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "user_not_found") {
      toast.error("User not found!");
    } else if (state.status === "invalid_method") {
      toast.error("Invalid method!");
    } else if (state.status === "success") {
      setIsSuccessful(true);
      toast.success(
        "Password reset email sent! Check your email for the link to reset your password."
      );

      setTimeout(() => {
        setIsSuccessful(false);
        router.refresh();
      }, 2000);
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16 pt-12">
          <h3 className="text-xl font-semibold text-foreground">
            Reset Password
          </h3>
          <p className="text-sm text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>
        <div className="px-4 sm:px-16 pb-12 w-full">
          <ResetPasswordForm action={handleSubmit}>
            <SubmitButton isSuccessful={isSuccessful}>
              Reset Password
            </SubmitButton>
            <div className="mt-4 flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <Link
                href="/login"
                className="font-semibold text-foreground hover:underline"
              >
                Back to login
              </Link>
              <p>
                {"Don't have an account? "}
                <Link
                  href="/register"
                  className="font-semibold text-foreground hover:underline"
                >
                  Sign up
                </Link>
                {" for free."}
              </p>
            </div>
          </ResetPasswordForm>
        </div>
      </div>
    </div>
  );
}
