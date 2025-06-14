const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-2 h-16 bg-white border-b-4 border-indigo-600">
      <div className="flex items-center">
        <button id="sidebarToggle" className="text-gray-500 lg:hidden p-2 mr-4">
          <i className="fas fa-bars" />
        </button>
        <div className="relative">
          <span className="absolute left-0 inset-y-0 pl-3 flex items-center">
            <i className="fas fa-search" />
          </span>
          <input
            className="focus:border-indigo-600 h-10 w-64 pl-10 pr-4 rounded-md"
            type="text"
            placeholder="검색"
          />
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <button className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=Oliver"
            alt="avatar"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
