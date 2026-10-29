"use client";

import { useEffect } from "react";
import { toast } from "@/lib/toast";

interface SignatureCopiedAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  autoCloseMs?: number;
  className?: string;
}

export default function SignatureCopiedAlert({
  isOpen,
  onClose,
  title = "Signature copied!",
  subtitle = "Paste it into your email client settings.",
  autoCloseMs = 4500,
}: SignatureCopiedAlertProps) {
  useEffect(() => {
    if (!isOpen) return;
    toast.copied(title, subtitle, autoCloseMs);
    onClose();
  }, [isOpen, title, subtitle, autoCloseMs, onClose]);

  return null;
}
