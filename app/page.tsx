import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Ashu 👋</h1>
        <p className="text-gray-600 mt-1">Apne trips aur bills yahan manage karo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/trips"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition"
        >
          <h2 className="font-semibold text-gray-900">🧳 My Trips</h2>
          <p className="text-sm text-gray-600 mt-1">Saare trips dekho, naya banao, bills add karo.</p>
        </Link>

        <Link
          href="/trips/new"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition"
        >
          <h2 className="font-semibold text-gray-900">➕ New Trip</h2>
          <p className="text-sm text-gray-600 mt-1">Nayi trip shuru karo aur expenses track karo.</p>
        </Link>
      </div>
    </div>
  );
}