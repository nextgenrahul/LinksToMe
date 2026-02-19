import React from "react";
import type { LinkCardProps } from "../types";

const LinkCard: React.FC<LinkCardProps> = ({
  name,
  username,
  role,
  profileImage,
  platformIcon,
  link,
}) => {
  return (
    <div className="relative w-full overflow-visible">
      <div className="absolute -right-3 -top-3 z-20">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg">
          <img
            className="w-6 h-6 object-contain"
            src={platformIcon}
            alt="platform"
          />
        </div>
      </div>

      <div
        className="
          relative z-10
          bg-zinc-900
          text-white
          rounded-2xl
          border border-zinc-800
          p-6
          shadow-lg
          transition-all duration-300
          hover:scale-[1.02]
          hover:border-zinc-600
        "
      >
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">Photo</span>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-zinc-400 text-sm">{username}</p>
            <p className="text-xs text-zinc-500 mt-1">{role}</p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              block text-center
              bg-white text-black
              py-3
              rounded-xl
              font-medium
              transition
              hover:bg-zinc-200
            "
          >
            Visit Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
