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
import AdminPlayerEdit from '../pages/admin/player/AdminPlayerEdit';
import AdminPlayerStaff from '../pages/admin/player/AdminPlayerStaff';
import AdminLeagueDetail from '../pages/admin/league/AdminLeagueDetail';
import AdminLeagueEdit from '../pages/admin/league/AdminLeagueEdit';
import AdminLeague from '../pages/admin/league/AdminLeague';
import { useParams } from 'react-router-dom';
import AdminMatch from '../pages/admin/match/AdminMatch';
import AdminVenue from '../pages/admin/venue/AdminVenue';
import AdminVenueEdit from '../pages/admin/venue/AdminVenueEdit';
import AdminMatchEdit from '../pages/admin/match/AdminMatchEdit';

function AdminTeamEditWithParams(props) {
  const { teamId } = useParams();
  return <AdminTeamEdit mode={CODE.MODE_MODIFY} teamId={teamId} {...props} />;
}

function AdminPlayerEditWithParams(props) {
  const { playerId } = useParams();
  return (
    <AdminPlayerEdit mode={CODE.MODE_MODIFY} playerId={playerId} {...props} />
  );
}

function AdminPlayerStaffEditWithParams(props) {
  const { coachId } = useParams();
  return (
    <AdminPlayerEdit mode={CODE.MODE_MODIFY} coachId={coachId} {...props} />
  );
}

function AdminVenueEditWithParams(props) {
  const { venueId } = useParams();
  return (
    <AdminVenueEdit mode={CODE.MODE_MODIFY} venueId={venueId} {...props} />
  );
}

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
            element={<AdminTeamEditWithParams />}
          />
          <Route path={URL.ADMIN_PLAYER} element={<AdminPlayer />} />
          <Route path={URL.ADMIN_PLAYER_STAFF} element={<AdminPlayerStaff />} />
          <Route
            path={URL.ADMIN_PLAYER_CREATE}
            element={<AdminPlayerEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={URL.ADMIN_PLAYER_MODIFY}
            element={<AdminPlayerEditWithParams />}
          />
          <Route
            path={URL.ADMIN_PLAYER_STAFF_MODIFY}
            element={<AdminPlayerStaffEditWithParams />}
          />
          <Route path={URL.ADMIN_LEAGUE} element={<AdminLeague />} />
          <Route
            path={URL.ADMIN_LEAGUE_DETAIL}
            element={<AdminLeagueDetail />}
          />
          <Route
            path={URL.ADMIN_LEAGUE_CREATE}
            element={<AdminLeagueEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={URL.ADMIN_LEAGUE_MODIFY}
            element={<AdminLeagueEdit mode={CODE.MODE_MODIFY} />}
          />
          <Route path={URL.ADMIN_VENUE} element={<AdminVenue />} />
          <Route
            path={URL.ADMIN_VENUE_CREATE}
            element={<AdminVenueEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={URL.ADMIN_VENUE_MODIFY}
            element={<AdminVenueEditWithParams />}
          />
          <Route path={URL.ADMIN_MATCH} element={<AdminMatch />} />
          <Route
            path={URL.ADMIN_MATCH_CREATE}
            element={<AdminMatchEdit mode={CODE.MODE_CREATE} />}
          />
        </Routes>
      </div>
    </>
  );
};

export default RootRoutes;
