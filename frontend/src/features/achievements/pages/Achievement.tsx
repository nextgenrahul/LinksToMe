import React from "react";
import AchievementCard from "../components/AchievementCard";

const Achievement = () => {
  return (
    <div className="p-8 text-white">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2sm font-semibold">Achievements</h1>
          <p className="text-zinc-400 text-sm">
            Showcase your professional accomplishments
          </p>
        </div>

        <button className="bg-white text-black px-5 py-2 rounded-sm font-medium hover:bg-zinc-200 transition">
          + Add Achievement
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search achievements..."
          className="bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-2 w-full focus:outline-none"
        />

        <select className="bg-zinc-900 border border-zinc-800 rounded-sm px-4 py-2">
          <option>Last Month</option>
          <option>3 Months</option>
          <option>6 Months</option>
        </select>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-10 text-center mb-10">
        <h2 className="text-lg font-semibold mb-2">
          Start Building Your Achievements
        </h2>
        <p className="text-zinc-400 mb-4">
          Add certifications, awards, or milestones to strengthen your profile
        </p>

        <button className="bg-white text-black px-6 py-2 rounded-sm hover:bg-zinc-200">
          Create First Achievement
        </button>
      </div>

      {/* Achievement Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <AchievementCard
          title="Google Cloud Certification"
          description="Completed Google Associate Cloud Engineer certification."
          date="Jan 2025"
          category="Certification"
          proofImage="https://via.placeholder.com/300"
        />

        <AchievementCard
          title="Hackathon Winner"
          description="Won 1st place in university AI hackathon."
          date="Aug 2024"
          category="Award"
          proofImage="https://via.placeholder.com/300"
        />

      </div>
    </div>
  );
};

export default Achievement;