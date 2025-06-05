import { useState } from "react";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

const platforms: Platform[] = [
  { id: "youtube", name: "YouTube", icon: "fab fa-youtube", color: "text-red-500", bgColor: "hover:bg-red-50" },
  { id: "instagram", name: "Instagram", icon: "fab fa-instagram", color: "text-pink-500", bgColor: "hover:bg-pink-50" },
  { id: "twitter", name: "Twitter", icon: "fab fa-twitter", color: "text-blue-500", bgColor: "hover:bg-blue-50" },
  { id: "facebook", name: "Facebook", icon: "fab fa-facebook", color: "text-blue-600", bgColor: "hover:bg-blue-50" },
  { id: "linkedin", name: "LinkedIn", icon: "fab fa-linkedin", color: "text-blue-700", bgColor: "hover:bg-blue-50" },
  { id: "tiktok", name: "TikTok", icon: "fab fa-tiktok", color: "text-black", bgColor: "hover:bg-gray-50" },
];

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export default function PlatformSelector({ selectedPlatform, onPlatformChange }: PlatformSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-3">Select Platform</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => onPlatformChange(platform.id)}
            className={cn(
              "p-3 border rounded-lg text-center transition-all",
              selectedPlatform === platform.id
                ? "border-2 border-primary bg-primary/5"
                : "border border-neutral-200 hover:bg-neutral-50"
            )}
          >
            <i className={`${platform.icon} ${platform.color} text-xl mb-1`} />
            <p className="text-xs font-medium">{platform.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}