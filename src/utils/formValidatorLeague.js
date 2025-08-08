const formValidatorLeague = (formData, tabType) => {
  if (!formData.get('name')) {
    if (tabType === 'LEAGUE') {
      alert('리그명을 입력하세요.');
    } else {
      alert('대회명을 입력하세요.');
    }
    return false;
  }
  if (!formData.get('region')) {
    alert('지역을 선택하세요.');
    return false;
  }
  if (!formData.get('startDate')) {
    alert('시작일을 입력하세요.');
    return false;
  }
  if (!formData.get('endDate')) {
    alert('종료일을 입력하세요.');
    return false;
  }
  return true;
};

export default formValidatorLeague;
