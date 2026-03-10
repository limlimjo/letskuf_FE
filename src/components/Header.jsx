const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-2 h-16 bg-white border-b-4 border-gray-800">
      <div className="flex items-center" />
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
