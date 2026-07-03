import Link from "next/link";
import { ArrowLeft, Ban } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(109,40,217,0.1)_0%,transparent_60%)] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-lg p-8 relative z-10 text-center">
        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <Ban className="w-12 h-12" />
        </div>
        
        <h1 className="text-8xl font-bold text-white mb-2 tracking-tighter">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-300 mb-6">Page Not Found</h2>
        <p className="text-neutral-500 mb-10 max-w-sm mx-auto">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl px-8 py-4 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
