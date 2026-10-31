import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#020305] flex flex-col items-center justify-center relative overflow-hidden font-data">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,228,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,228,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="relative z-10 text-center px-6">
        <p className="text-ice tracking-[0.3em] text-sm mb-4">ERROR_CODE: 404</p>
        <h1 className="text-6xl md:text-9xl font-shout font-black text-paper uppercase tracking-tighter mb-6">
          SIGNAL <span className="text-ice">LOST.</span>
        </h1>
        <p className="text-muted text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          The sector you are trying to access does not exist in this mainframe. It may have been moved, deleted, or never existed.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center gap-3 bg-paper text-ink px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-lime transition-colors"
        >
          <ArrowLeft size={16} /> Return to Mainframe
        </Link>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-ice/20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-ice/20" />
    </main>
  );
}