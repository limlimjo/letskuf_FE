import { NavLink } from 'react-router-dom';
import URL from '../../constants/url';

const LeftMenuAdmin = () => {
  return (
    <aside
      id="sidebar"
      className="bg-gray-800 w-64 text-white py-7 px-2 space-y-6 z-10 inset-y-0 left-0 -translate-x-full lg:translate-x-0 absolute lg:relative transition duration-200"
    >
      <div className="flex justify-between items-center px-4 mb-10">
        <h2 className="text-2xl font-semibold">LetsKuf 관리자</h2>
        <button id="closeSidebar" className="text-white lg:hidden">
          <i className="fas fa-times" />
        </button>
      </div>
      <nav className="flex flex-col gap-y-3">
        <div className="flex flex-col">
          <p className="text-xl font-bold py-1.5 px-4 rounded">팀 관리</p>
          <NavLink
            to={URL.ADMIN_TEAM}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            팀 목록
          </NavLink>
          <NavLink
            to={URL.ADMIN_TEAM_CREATE}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            팀 등록
          </NavLink>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold py-1.5 px-4 rounded">선수단 관리</p>
          <NavLink
            to={URL.ADMIN_PLAYER}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            선수단 목록
          </NavLink>
          <NavLink
            to={URL.ADMIN_PLAYER_CREATE}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            선수단 등록
          </NavLink>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold py-1.5 px-4 rounded">
            리그/대회 관리
          </p>
          <a
            href="#"
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            리그/대회 목록
          </a>
          <a
            href="#"
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            리그/대회 등록
          </a>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold py-1.5 px-4 rounded">경기 관리</p>
          <a
            href="#"
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            경기 목록
          </a>
          <a
            href="#"
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            경기 등록
          </a>
          <a
            href="#"
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            실시간 경기 등록
          </a>
        </div>
      </nav>
    </aside>
  );
};

export default LeftMenuAdmin;
