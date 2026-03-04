import React from "react";

type Props = {
  title: string;
  description: string;
  date: string;
  category: string;
  proofImage?: string;
};

const AchievementCard: React.FC<Props> = ({
  title,
  description,
  date,
  category,
  proofImage,
}) => {
  return (
    <div
      className="
      bg-zinc-900
      border border-zinc-800
      rounded-2xl
      overflow-hidden
      shadow-lg
      transition-all duration-300
      hover:border-zinc-600
      hover:scale-[1.02]
      "
    >
      {/* Proof Image */}
      {proofImage && (
        <div className="h-40 w-full overflow-hidden">
          <img
            src={proofImage}
            alt="proof"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mt-5 text-xs text-zinc-500">
          <span>{date}</span>
          <span className="bg-zinc-800 px-3 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-white text-black py-2 rounded-xl text-sm hover:bg-zinc-200">
            View
          </button>

          <button className="flex-1 border border-zinc-700 py-2 rounded-xl text-sm hover:bg-zinc-800">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;