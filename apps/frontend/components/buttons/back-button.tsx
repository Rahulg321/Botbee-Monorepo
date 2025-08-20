"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button size="sm" onClick={() => router.back()} className="cursor-pointer">
      <ArrowLeft className="w-4 h-4" />
    </Button>
  );
};

export default BackButton;
