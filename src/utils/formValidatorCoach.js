const formValidatorCoach = (formData, playerGbn) => {
  // 공통: 이름, 생년월일, 소속팀, 분류
  if (!formData.get('name')) {
    alert('이름을 입력하세요.');
    return false;
  }
  if (!formData.get('birthDate')) {
    alert('생년월일을 입력하세요.');
    return false;
  }
  if (!formData.get('teamId')) {
    alert('소속팀을 선택하세요.');
    return false;
  }
  if (!formData.get('typeGbn')) {
    alert('분류를 선택하세요.');
    return false;
  }

  if (playerGbn === '1') {
    // 선수: 포지션, 학년, 배번, 신장, 체중
    if (!formData.get('position')) {
      alert('포지션을 입력하세요.');
      return false;
    }
    if (!formData.get('grade')) {
      alert('학년을 입력하세요.');
      return false;
    }
    if (!formData.get('uniformNum')) {
      alert('배번을 입력하세요.');
      return false;
    }
    if (!formData.get('height')) {
      alert('신장을 입력하세요.');
      return false;
    }
    if (!formData.get('weight')) {
      alert('체중을 입력하세요.');
      return false;
    }
  } else if (playerGbn === '2' || playerGbn === '3') {
    // 코칭스태프/임원: 직책
    if (!formData.get('title')) {
      alert('직책을 입력하세요.');
      return false;
    }
  }
  return true;
};

export default formValidatorCoach;
