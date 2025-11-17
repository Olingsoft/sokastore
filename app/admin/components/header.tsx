import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#141313] text-white flex items-center justify-between px-6 py-4 shadow-md">
      <h2 className="text-xl font-semibold">Welcome, Admin 👋</h2>
      <div className="flex items-center gap-4">
        <Bell className="w-6 h-6 text-gray-300 cursor-pointer hover:text-accentTeal transition" />
        <img
          src="https://i.pravatar.cc/40"
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full border-2 border-accentTeal"
        />
      </div>
    </header>
  );
};

export default Header;
