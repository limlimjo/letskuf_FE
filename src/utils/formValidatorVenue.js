const formValidatorVenue = formData => {
  if (formData.get('venueNm') === null || formData.get('venueNm') === '') {
    alert('장소명을 입력하세요.');
    return false;
  }
  if (
    formData.get('postcode') === null ||
    formData.get('postcode') === '' ||
    formData.get('address') === null ||
    formData.get('address') === ''
  ) {
    alert('주소를 검색하세요.');
    return false;
  }
  // if (
  //   formData.get('detailAddress') === null ||
  //   formData.get('detailAddress') === ''
  // ) {
  //   alert('상세주소를 입력하세요.');
  //   return false;
  // }
  return true;
};

export default formValidatorVenue;
