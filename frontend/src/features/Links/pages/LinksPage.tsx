import LinkCard from "../components/LinkCard";

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">

      {/* Profile Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="w-24 h-24 rounded-full bg-zinc-800 mx-auto" />
        <h1 className="text-3xl font-semibold">Rahul Shakya</h1>
        <p className="text-zinc-400 text-sm">Digital Identity Hub</p>
      </div>

      <div className="max-w-490 mx-auto ">
        <div
  className="
    grid gap-8
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-2
    xl:grid-cols-3
  "
        >
          <LinkCard
            name="Rahul"
            username="@rahul123"
            role="Software Engineer"
            profileImage="https://media.licdn.com/dms/image/v2/D5603AQG3RMNqAv6Vug/profile-displayphoto-scale_200_200/B56Zt1MVV9HAAY-/0/1767197727545?e=2147483647&v=beta&t=9unLGxNl9C2LhqEoFvqv0Qhph619ywENBA8zd8wSSTs"
            platformIcon="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
            link="https://instagram.com"
          />

          <LinkCard
            name="Rahul"
            username="@rahul123"
            role="Software Engineer"
            platformIcon="https://upload.wikimedia.org/wikipedia/commons/8/89/Facebook_Logo_%282019%29.svg"
            link="https://facebook.com"
          />

          <LinkCard
            name="Rahul"
            username="@rahul123"
            role="Software Engineer"
            platformIcon="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg"
            link="https://x.com"
          />

          <LinkCard
            name="Rahul"
            username="@rahul123"
            role="Software Engineer"
            platformIcon="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
            link="https://linkedin.com"
          />
        </div>
      </div>
    </div>
  );
}
