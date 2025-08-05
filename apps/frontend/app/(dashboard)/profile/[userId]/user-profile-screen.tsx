"use client";

import { useState } from "react";
import { Edit2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@repo/db/schema";
import { ProfilePicUploadDialog } from "@/components/dialogs/profile-pic-upload-dialog";

export default function UserProfileScreen({
  currentLoggedInUser,
}: {
  currentLoggedInUser: UserType;
}) {
  return (
    <div className="w-full min-h-screen py-8 px-2 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-8">
          <Card className="flex-1 max-w-xl w-full mx-auto md:mx-0 shadow-lg">
            <CardHeader className="flex flex-col items-center gap-4 pt-8 pb-4">
              <Avatar className="size-28 border-4 border-primary shadow-md">
                <AvatarImage
                  src={
                    currentLoggedInUser.image || "https://github.com/shadcn.png"
                  }
                  alt="Profile"
                />
                <AvatarFallback style={{ background: "hsl(var(--muted))" }}>
                  <User
                    className="size-12"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  />
                </AvatarFallback>
              </Avatar>
              <ProfilePicUploadDialog userId={currentLoggedInUser.id} />
              <h2 className="text-xl font-semibold text-foreground">
                Hello {currentLoggedInUser.name?.split(" ")[0] || "User"}
              </h2>
            </CardHeader>
          </Card>

          {/* Right Section - Subscription Info */}
          <Card className="flex-1 max-w-md w-full mx-auto md:mx-0 shadow-lg mt-8 md:mt-0">
            <CardHeader className="flex flex-col items-center pt-8 pb-4 gap-2">
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Current Plan
              </h3>
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg
                    className="absolute top-0 left-0 w-full h-full"
                    viewBox="0 0 96 96"
                  >
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={2 * Math.PI * 44 * 0.2} // 80% left
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-lg font-bold text-foreground">
                    6
                  </span>
                  <span className="absolute bottom-2 text-xs text-muted-foreground">
                    Days Left
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base font-medium text-primary">
                    Free Trial
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">
                      Next payment on
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      9th July, 2024
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-6 pb-8">
              <Button
                className="w-full font-semibold"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Upgrade Plan
              </Button>
              <Button
                variant="outline"
                className="w-full"
                style={{
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                  background: "hsl(var(--background))",
                }}
              >
                Cancel Plan
              </Button>
              <Button
                className="w-full font-semibold"
                style={{
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--foreground))",
                }}
              >
                Billing Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full"
                style={{
                  borderColor: "hsl(var(--destructive))",
                  color: "hsl(var(--destructive))",
                  background: "hsl(var(--background))",
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
