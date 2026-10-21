"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { subscribeToasts } from "@/lib/toast";

type ToastPayload = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const colors = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  error: "bg-rose-50 border-rose-200 text-rose-800",
  info: "bg-indigo-50 border-indigo-200 text-indigo-800",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  useEffect(() => {
    return subscribeToasts(setToasts);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-2 rounded-lg border px-4 py-3 shadow-sm text-sm ${colors[t.type]}`}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}