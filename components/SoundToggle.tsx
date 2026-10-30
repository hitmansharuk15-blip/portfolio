"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { playTick } from "@/lib/audio"; // <-- IMPORTED

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const savedMute = localStorage.getItem("site-muted");
    if (savedMute === "false") setIsMuted(false);
  }, []);

  const toggleMute = () => {
    const newMute = !isMuted;
    
    // Play a tick to confirm the click (force play by passing false)
    playTick(false); 

    setIsMuted(newMute);
    localStorage.setItem("site-muted", String(newMute));
    
    window.dispatchEvent(new Event("sound-toggled"));
  };

  return (
    <button
      onClick={toggleMute}
      className="w-10 h-10 rounded-full glass flex items-center justify-center text-paper hover:scale-110 transition-transform"
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}