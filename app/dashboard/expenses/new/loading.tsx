export default function ExpenseLoading() {
  return (
    <div className="max-w-md mx-auto animate-pulse">
      {/* Back button skeleton */}
      <div className="h-8 w-32 bg-slate-200 rounded-full mb-6" />
      
      <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200">
        {/* Form field skeleton */}
        <div>
          <div className="h-4 w-20 bg-slate-200 rounded mb-2" />
          <div className="h-10 w-full bg-slate-100 rounded-lg" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-16 bg-slate-200 rounded mb-2" />
            <div className="h-10 w-full bg-slate-100 rounded-lg" />
          </div>
          <div>
            <div className="h-4 w-16 bg-slate-200 rounded mb-2" />
            <div className="h-10 w-full bg-slate-100 rounded-lg" />
          </div>
        </div>

        <div>
          <div className="h-4 w-20 bg-slate-200 rounded mb-2" />
          <div className="h-10 w-full bg-slate-100 rounded-lg" />
        </div>

        <div>
          <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 bg-slate-100 rounded-lg" />
            <div className="h-10 flex-1 bg-slate-100 rounded-lg" />
          </div>
        </div>

        <div className="h-12 w-full bg-slate-200 rounded-xl mt-4" />
      </div>
    </div>
  );
}