"use client";

export default function RightPanel() {
  return (
    <aside className="space-y-4">
      <div className="bg-zinc-900 p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Trends for you</h2>
        <ul className="mt-2 text-sm text-zinc-400">
          <li>#NextJS</li>
          <li>#AI</li>
          <li>#WebDevelopment</li>
        </ul>
      </div>
      <div className="bg-zinc-900 p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Who to follow</h2>
        <p className="text-sm text-zinc-400 mt-2">@nextigenrahul</p>
      </div>
    </aside>
  );
}
