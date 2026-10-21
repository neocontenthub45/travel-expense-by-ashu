"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function StorageWarning() {
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    async function checkStorage() {
      const { data } = await supabase
        .from("expenses")
        .select("file_size")
        .not("receipt_url", "is", null);
      
      if (data) {
        const sum = data.reduce((acc, curr) => acc + (Number(curr.file_size) || 0), 0);
        setTotalSize(sum);
      }
    }
    checkStorage();
  }, []);

  const sizeInMB = totalSize / (1024 * 1024);

  // Agar 800MB se zyada ho jaye toh warning dikhao (1GB limit ka)
  if (sizeInMB < 800) return null;

  return (
    <div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-amber-800 text-sm">Storage Almost Full</h3>
        <p className="text-amber-700 text-xs mt-1">
          You have used {sizeInMB.toFixed(1)} MB of your 1GB storage. Please export and delete bills from claimed trips to free up space.
        </p>
      </div>
    </div>
  );
}