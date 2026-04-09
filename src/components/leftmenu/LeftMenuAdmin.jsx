import { Link, NavLink } from 'react-router-dom';
import URL from '../../constants/url';

const LeftMenuAdmin = () => {
  return (
    <aside
      id="sidebar"
      className="bg-gray-800 w-64 shrink-0 text-white py-7 px-2 space-y-6"
    >
      <div className="flex justify-between items-center px-4 mb-10">
        <Link className="text-2xl font-semibold" to="/">
          Letskuf 관리자
        </Link>
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
            선수단 목록 (선수)
          </NavLink>
          <NavLink
            to={URL.ADMIN_PLAYER_STAFF}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            선수단 목록 (코칭스태프/임원)
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
          <NavLink
            to={URL.ADMIN_LEAGUE}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            리그/대회 목록
          </NavLink>
          <NavLink
            to={URL.ADMIN_LEAGUE_CREATE}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            리그/대회 등록
          </NavLink>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold py-1.5 px-4 rounded">경기장소 관리</p>
          <NavLink
            to={URL.ADMIN_VENUE}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            경기장소 목록
          </NavLink>
          <NavLink
            to={URL.ADMIN_VENUE_CREATE}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            경기장소 등록
          </NavLink>
        </div>
        <div className="flex flex-col">
          <p className="text-xl font-bold py-1.5 px-4 rounded">경기 관리</p>
          <NavLink
            to={URL.ADMIN_MATCH}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            경기 목록
          </NavLink>
          <NavLink
            to={URL.ADMIN_MATCH_CREATE}
            className="py-1.5 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
          >
            경기 등록
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default LeftMenuAdmin;
