"use client";

export default function FeedLayout() {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home Feed</h1>
      <div className="space-y-4">
        <div className="bg-zinc-900 p-4 rounded-lg">Post #1</div>
        <div className="bg-zinc-900 p-4 rounded-lg">Post #2</div>
        <div className="bg-zinc-900 p-4 rounded-lg">Post #3</div>
      </div>
    </section>
  );
}
