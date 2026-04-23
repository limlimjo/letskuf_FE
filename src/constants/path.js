const PATH = {
  //ADMIN-TEAM
  ADMIN_TEAM: '/team',
  ADMIN_TEAM_DETAIL: '/team/:teamId',
  ADMIN_TEAM_CREATE: '/team/create',
  ADMIN_TEAM_MODIFY: '/team/:teamId/modify',

  //ADMIN-PLAYER
  ADMIN_PLAYER: '/player',
  ADMIN_PLAYER_STAFF: '/player/staff',
  ADMIN_PLAYER_DETAIL: '/player/:playerId',
  ADMIN_PLAYER_CREATE: '/player/create',
  ADMIN_PLAYER_MODIFY: '/player/:playerId/modify',
  ADMIN_PLAYER_STAFF_MODIFY: '/player/staff/:coachId/modify',

  //ADMIN-LEAGUE
  ADMIN_LEAGUE: '/league',
  ADMIN_LEAGUE_DETAIL: '/league/:leagueId',
  ADMIN_LEAGUE_CREATE: '/league/create',
  ADMIN_LEAGUE_MODIFY: '/league/:leagueId/modify',

  //ADMIN-VENUE
  ADMIN_VENUE: '/venue',
  ADMIN_VENUE_DETAIL: '/venue/:venueId',
  ADMIN_VENUE_CREATE: '/venue/create',
  ADMIN_VENUE_MODIFY: '/venue/:venueId/modify',

  //ADMIN-MATCH
  ADMIN_MATCH: '/match',
  ADMIN_MATCH_DETAIL: '/match/:matchId',
  ADMIN_MATCH_CREATE: '/match/create',
  ADMIN_MATCH_MODIFY: '/match/:matchId/modify',
  ADMIN_MATCH_DETAIL_LIVE: '/match/:matchId/live',
};

export default PATH;
