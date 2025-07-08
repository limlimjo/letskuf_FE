// route 모아놓는 곳
import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import URL from '../constants/url';
import CODE from '../constants/code';
import AdminTeam from '../pages/admin/team/AdminTeam';
import LeftMenuAdmin from '../components/leftmenu/LeftMenuAdmin';
import AdminTeamDetail from '../pages/admin/team/AdminTeamDetail';
import AdminTeamEdit from '../pages/admin/team/AdminTeamEdit';
import AdminPlayer from '../pages/admin/player/AdminPlayer';
import AdminPlayerDetail from '../pages/admin/player/AdminPlayerDetail';
import AdminPlayerEdit from '../pages/admin/player/AdminPlayerEdit';

const RootRoutes = () => {
  return (
    <>
      <LeftMenuAdmin />
      <div className="flex-1 flex flex-col">
        <Header />
        <Routes>
          <Route path={URL.ADMIN_TEAM} element={<AdminTeam />} />
          <Route path={URL.ADMIN_TEAM_DETAIL} element={<AdminTeamDetail />} />
          <Route
            path={URL.ADMIN_TEAM_CREATE}
            element={<AdminTeamEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={URL.ADMIN_TEAM_MODIFY}
            element={<AdminTeamEdit mode={CODE.MODE_MODIFY} />}
          />
          <Route path={URL.ADMIN_PLAYER} element={<AdminPlayer />} />
          <Route
            path={URL.ADMIN_PLAYER_DETAIL}
            element={<AdminPlayerDetail />}
          />
          <Route
            path={URL.ADMIN_PLAYER_CREATE}
            element={<AdminPlayerEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={URL.ADMIN_PLAYER_MODIFY}
            element={<AdminPlayerEdit mode={CODE.MODE_MODIFY} />}
          />
        </Routes>
      </div>
    </>
  );
};

export default RootRoutes;
