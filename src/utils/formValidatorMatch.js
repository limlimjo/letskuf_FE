const formValidatorMatch = (data, tabType) => {
  if (!data.leagueId) {
    if (tabType === 'LEAGUE') {
      alert('리그명을 선택하세요.');
    } else {
      alert('대회명을 선택하세요.');
    }
    return false;
  }

  if (!data.venueId) {
    alert('장소를 선택하세요.');
    return false;
  }

  if (!data.matchDate) {
    alert('경기일자를 입력하세요.');
    return false;
  }

  if (!data.kickoffTime) {
    alert('경기시간을 입력하세요.');
    return false;
  }

  return true;
};

export default formValidatorMatch;
