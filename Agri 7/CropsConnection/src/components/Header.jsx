import { NavLink } from "react-router-dom";
import { FiBell, FiFeather } from "react-icons/fi";

const tabs = [
  { label: "Feed", to: "/" },
  { label: "Chats", to: "/chats" },
  { label: "Following", to: "/following" },
  { label: "Profile", to: "/profile" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-line">
      <div className="max-w-md mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFeather className="text-forest text-xl" />
            <span className="font-display text-lg font-semibold text-forest">CropsConnection</span>
          </div>
          <button aria-label="Notifications" className="text-soil/70 hover:text-forest transition-colors">
            <FiBell size={20} />
          </button>
        </div>
        <nav className="flex gap-5 mt-3 text-sm">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `pb-2 border-b-2 transition-colors ${
                  isActive
                    ? "border-forest text-forest font-medium"
                    : "border-transparent text-soil/60 hover:text-soil"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
