import { useTheme } from "../../../context/useTheme";
const HomePage = () => {
  const { toggleTheme, theme } = useTheme();
  return (
    <aside className="flex flex-col h-screen p-4 border-r border-zinc-800 bg-[--background]">
      <button
        onClick={toggleTheme}
        className="mt-auto flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-all"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          {theme === "dark" ? "☀️" : "🌙"}
        </div>
        <span className="text-xl font-medium">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </button>
    </aside>
  );
};

export default HomePage;
