const URL = {
  //ADMIN-LOGIN
  ADMIN_LOGIN: '/admin/login',

  //ADMIN-TEAM
  ADMIN_TEAM: '/admin/team',
  ADMIN_TEAM_DETAIL: '/admin/team/:teamId',
  ADMIN_TEAM_CREATE: '/admin/team/create',
  ADMIN_TEAM_MODIFY: '/admin/team/:teamId/modify',

  //ADMIN-PLAYER
  ADMIN_PLAYER: '/admin/player',
  ADMIN_PLAYER_STAFF: '/admin/player/staff',
  ADMIN_PLAYER_DETAIL: '/admin/player/:playerId',
  ADMIN_PLAYER_CREATE: '/admin/player/create',
  ADMIN_PLAYER_MODIFY: '/admin/player/:playerId/modify',
  ADMIN_PLAYER_STAFF_MODIFY: '/admin/player/staff/:coachId/modify',

  //ADMIN-LEAGUE
  ADMIN_LEAGUE: '/admin/league',
  ADMIN_LEAGUE_DETAIL: '/admin/league/:leagueId',
  ADMIN_LEAGUE_CREATE: '/admin/league/create',
  ADMIN_LEAGUE_MODIFY: '/admin/league/:leagueId/modify',

  //ADMIN-VENUE
  ADMIN_VENUE: '/admin/venue',
  ADMIN_VENUE_DETAIL: '/admin/venue/:venueId',
  ADMIN_VENUE_CREATE: '/admin/venue/create',
  ADMIN_VENUE_MODIFY: '/admin/venue/:venueId/modify',

  //ADMIN-MATCH
  ADMIN_MATCH: '/admin/match',
  ADMIN_MATCH_DETAIL: '/admin/match/:matchId',
  ADMIN_MATCH_CREATE: '/admin/match/create',
  ADMIN_MATCH_MODIFY: '/admin/match/:matchId/modify',
  ADMIN_MATCH_LIVE: '/admin/match/:matchId/live',

  getAdminMatchLive: matchId => `/admin/match/${matchId}/live`,
};

export default URL;
