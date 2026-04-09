const formValidatorVenue = data => {
  if (!data.venueNm) {
    alert('장소명을 입력하세요.');
    return false;
  }
  if (!data.postcode || !data.address) {
    alert('주소를 검색하세요.');
    return false;
  }
  return true;
};

export default formValidatorVenue;
