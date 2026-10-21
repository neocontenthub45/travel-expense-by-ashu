"use client";

import { AlertTriangle } from "lucide-react";

export default function StorageBar({ expenses }: { expenses: any[] }) {
  const totalSize = expenses.reduce((acc, curr) => acc + (Number(curr.file_size) || 0), 0);
  const sizeInMB = totalSize / (1024 * 1024);
  const limitMB = 1024;
  const percentage = Math.min((sizeInMB / limitMB) * 100, 100);
  const isWarning = percentage > 70;

  return (
    <div className={`p-4 rounded-xl border ${isWarning ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
          <span className={`text-sm font-medium ${isWarning ? 'text-amber-800' : 'text-slate-700'}`}>
            Storage Usage
          </span>
        </div>
        <span className={`text-xs ${isWarning ? 'text-amber-700' : 'text-slate-500'}`}>
          {sizeInMB.toFixed(1)} MB / 1 GB
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${isWarning ? 'bg-amber-500' : 'bg-indigo-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isWarning && (
        <p className="text-xs text-amber-700 mt-2">
          Storage filling up. Export and delete claimed bills to free space.
        </p>
      )}
    </div>
  );
}