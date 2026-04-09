const formValidatorLeague = (data, tabType) => {
  if (!data.name) {
    if (tabType === 'LEAGUE') {
      alert('리그명을 입력하세요.');
    } else {
      alert('대회명을 입력하세요.');
    }
    return false;
  }

  if (!data.region) {
    alert('지역을 선택하세요.');
    return false;
  }

  if (!data.startDate) {
    alert('시작일을 입력하세요.');
    return false;
  }

  if (!data.endDate) {
    alert('종료일을 입력하세요.');
    return false;
  }

  return true;
};

export default formValidatorLeague;
