export default function NotificationsPage() {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        <div className="bg-zinc-900 p-4 rounded-lg">You have a new follower.</div>
        <div className="bg-zinc-900 p-4 rounded-lg">Someone liked your post.</div>
      </div>
    </section>
  );
}
