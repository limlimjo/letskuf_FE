// route 모아놓는 곳
import { Route, Routes } from 'react-router-dom';

import CODE from '../constants/code';
import Header from '../components/common/Header';
import AdminTeam from '../pages/admin/team/AdminTeam';
import LeftMenuAdmin from '../components/common/leftmenu/LeftMenuAdmin';
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
import PATH from '../constants/path';
import AdminMatchLiveEdit from '../pages/admin/match/AdminMatchLiveEdit';
import AdminMatchDetail from '../pages/admin/match/AdminMatchDetail';
import AdminMatchLineup from '../pages/admin/match/AdminMatchLineup';
import AdminMatchResult from '../pages/admin/match/AdminMatchResult';


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

function AdminMatchEditWithParams(props) {
  const { matchId } = useParams();
  return (
    <AdminMatchEdit mode={CODE.MODE_MODIFY} matchId={matchId} {...props} />
  );
}

function AdminMatchDetailWithParams(props) {
  const { matchId } = useParams();
  return <AdminMatchDetail matchId={matchId} {...props} />;
}
function AdminMatchLineupWithParams(props) {
  const { matchId } = useParams();
  return <AdminMatchLineup matchId={matchId} {...props} />;
}

function AdminMatchLiveEditWithParams(props) {
  const { matchId } = useParams();
  return <AdminMatchLiveEdit matchId={matchId} {...props} />;
}

const RootRoutes = () => {
  return (
    <>
      <LeftMenuAdmin />
      <div className="flex-1 flex flex-col">
        <Header />
        <Routes>
          <Route path={PATH.ADMIN_TEAM} element={<AdminTeam />} />
          <Route path={PATH.ADMIN_TEAM_DETAIL} element={<AdminTeamDetail />} />
          <Route
            path={PATH.ADMIN_TEAM_CREATE}
            element={<AdminTeamEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={PATH.ADMIN_TEAM_MODIFY}
            element={<AdminTeamEditWithParams />}
          />
          <Route path={PATH.ADMIN_PLAYER} element={<AdminPlayer />} />
          <Route
            path={PATH.ADMIN_PLAYER_STAFF}
            element={<AdminPlayerStaff />}
          />
          <Route
            path={PATH.ADMIN_PLAYER_CREATE}
            element={<AdminPlayerEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={PATH.ADMIN_PLAYER_MODIFY}
            element={<AdminPlayerEditWithParams />}
          />
          <Route
            path={PATH.ADMIN_PLAYER_STAFF_MODIFY}
            element={<AdminPlayerStaffEditWithParams />}
          />
          <Route path={PATH.ADMIN_LEAGUE} element={<AdminLeague />} />
          <Route
            path={PATH.ADMIN_LEAGUE_DETAIL}
            element={<AdminLeagueDetail />}
          />
          <Route
            path={PATH.ADMIN_LEAGUE_CREATE}
            element={<AdminLeagueEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={PATH.ADMIN_LEAGUE_MODIFY}
            element={<AdminLeagueEdit mode={CODE.MODE_MODIFY} />}
          />
          <Route path={PATH.ADMIN_VENUE} element={<AdminVenue />} />
          <Route
            path={PATH.ADMIN_VENUE_CREATE}
            element={<AdminVenueEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={PATH.ADMIN_VENUE_MODIFY}
            element={<AdminVenueEditWithParams />}
          />
          <Route path={PATH.ADMIN_MATCH} element={<AdminMatch />} />
          <Route
            path={PATH.ADMIN_MATCH_CREATE}
            element={<AdminMatchEdit mode={CODE.MODE_CREATE} />}
          />
          <Route
            path={PATH.ADMIN_MATCH_MODIFY}
            element={<AdminMatchEditWithParams />}
          />
          <Route
            path={PATH.ADMIN_MATCH_DETAIL}
            element={<AdminMatchDetailWithParams />}
          />
          <Route
            path={PATH.ADMIN_MATCH_LINEUP}
            element={<AdminMatchLineupWithParams readOnly={false} />}
          />
          <Route
            path={PATH.ADMIN_MATCH_LINEUP_READONLY}
            element={<AdminMatchLineupWithParams readOnly={true} />}
          />
          <Route
            path={PATH.ADMIN_MATCH_LIVE}
            element={<AdminMatchLiveEditWithParams />}
          />
          <Route path={PATH.ADMIN_MATCH_RESULT} element={<AdminMatchResult />} />
        </Routes>
      </div>
    </>
  );
};

export default RootRoutes;
