import { Link, useLocation } from "react-router-dom";
import { navigation } from "../constants/sidebar.constants";

export default function BottomNavbar() {
  const { pathname } = useLocation();

  return (
    <div
      className="
      fixed bottom-0 left-0 right-0
      h-16
      bg-black
      border-t border-zinc-800
      flex items-center justify-around
      z-50
      "
    >
      {navigation.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center justify-center"
          >
            <img
              src={active ? item.mainImg : item.hoverImg}
              alt={item.name}
              className="w-7 h-7"
            />
          </Link>
        );
      })}
    </div>
  );
}
