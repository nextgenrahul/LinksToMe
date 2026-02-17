import apiClient from "@/shared/api/apiClient";
import { useEffect, useState } from "react";
import type { Profile as ProfileType } from "../types";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get<{ data: ProfileType }>("/profile/me");
      setProfile(res.data.data);
    } catch (err) {
      console.log("Error:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (error) return <div className="text-red-500 p-10">{error}</div>;
  if (!profile) return null;

  return (
    <main className="border-x border-gray-500 max-w-2xl bg-black text-white min-h-screen">
      {/* Profile Header */}
      <div className="relative">
        {/* Banner */}
        <div className="h-48 bg-linear-to-b from-blue-900 to-blue-800 relative flex items-center justify-center">
            {/* Placeholder for banner if available in future */}
        </div>

        {/* Profile Picture */}
        <div className="absolute left-8 top-30">
          <div className="w-32 h-32 bg-gray-700 rounded-full border-4 border-black flex items-center justify-center overflow-hidden">
             {profile.profile_picture_url ? (
                <img src={profile.profile_picture_url} alt={profile.name} className="w-full h-full object-cover" />
             ) : (
                <span className="text-5xl">👤</span>
             )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {profile.name}
                {profile.is_verified && <span className="text-blue-500">✔</span>}
              </h2>
              <p className="text-gray-500 text-lg">@{profile.username}</p>
            </div>
            <button className="border border-gray-500 hover:bg-gray-900 px-6 py-2 rounded-full font-semibold transition">
              Edit profile
            </button>
          </div>

          {profile.bio && (
            <p className="mt-4 text-lg whitespace-pre-wrap">{profile.bio}</p>
          )}
          
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline block mt-2">
              🔗 {profile.website}
            </a>
          )}

          <div className="flex gap-4 mt-2 flex-wrap">
             {profile.interests.map((i, idx) => (
                 <span key={idx} className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                     {i.interest}
                 </span>
             ))}
          </div>

           <div className="flex gap-4 mt-2 flex-wrap">
             {profile.links.map((link, idx) => (
                 <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                     🔗 {link.label}
                 </a>
             ))}
          </div>
          
           <div className="flex gap-4 mt-2 flex-wrap">
             {profile.badges.map((b, idx) => (
                 <span key={idx} title={b.badge_code} className="text-xl">
                    🏅
                 </span>
             ))}
          </div>

          <div className="flex gap-6 mt-4 text-gray-500">
             {/* Join date would come from createdAt if we added it to the type, for now static or omitted if not in type clearly */}
          </div>

          <div className="flex gap-6 mt-4">
            <span>
              <strong className="text-white">{profile.following_count}</strong> Following
            </span>
            <span>
              <strong className="text-white">{profile.followers_count}</strong> Followers
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-500 mt-4">
        {["Posts", "Replies", "Highlights", "Articles", "Media", "Likes"].map(
          (tab) => (
            <button
              key={tab}
              className={`flex-1 py-4 text-center hover:bg-gray-900 transition ${
                tab === "Posts"
                  ? "border-b-4 border-blue-500 font-bold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ),
        )}
      </div>

      {/* Post Placeholder - In future, this should also come from API */}
      <div className="p-4 text-center text-gray-500">
          No posts yet.
      </div>
    </main>
  );
}

