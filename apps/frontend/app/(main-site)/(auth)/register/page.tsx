"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import { AuthForm } from "@/components/forms/auth-form";
import { SubmitButton } from "@/components/buttons/submit-button";

import { register, type RegisterActionState } from "@/lib/actions";
import { toast } from "sonner";
import SigninGoogle from "@/components/buttons/google-sign-in-button";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("Account already exists!");
    } else if (state.status === "failed") {
      toast.error("Failed to create account!");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "sent_email") {
      toast.success(
        "Account created successfully! Please check your email for a verification link."
      );

      setIsSuccessful(false);
    }
  }, [state]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold text-foreground">Sign Up</h3>
          <p className="text-sm text-muted-foreground">
            Create an account with your email and password
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>Sign Up</SubmitButton>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {"Already have an account? "}
            <Link
              href="/login"
              className="font-semibold text-foreground hover:underline"
            >
              Sign in
            </Link>
            {" instead."}
          </p>
        </AuthForm>
        <SigninGoogle />
      </div>
    </div>
  );
}
