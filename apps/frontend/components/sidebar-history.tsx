"use client";

import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import type { User } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { fetcher } from "@/lib/utils";
import useSWRInfinite from "swr/infinite";
import React from "react";

const SidebarHistory = () => {
  return <div>SidebarHistory</div>;
};

export default SidebarHistory;
