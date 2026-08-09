import { useEffect, useRef, useState } from 'react';
import CODE from '../../../constants/code';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import URL from '../../../constants/url';
import * as ApiFetch from '../../../api/apiFetch';
import formValidatorVenue from '../../../utils/formValidatorVenue';

const AdminVenueEdit = props => {
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [venueInfo, setVenueInfo] = useState({});

  const detailAddressRef = useRef(null);
  const navigate = useNavigate();

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: '등록',
          editURL: '/admin/venue/create',
        });
        break;

      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: '수정',
          editURL: `/admin/venue/${props.venueId}/modify`,
        });
        break;
    }
  };

  // 다음 주소 호출
  const handleOpenDaumPostCode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          //console.log(data);
          // 각 주소의 노출 규칙에 따라 주소를 조합
          // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기
          var addr = ''; // 주소 변수

          //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져옴
          if (data.userSelectedType === 'R') {
            // 사용자가 도로명 주소를 선택했을 경우
            addr = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress;
          }
          // 우편번호와 주소 정보 세팅
          setVenueInfo(prev => ({
            ...prev,
            postcode: data.zonecode,
            address: addr,
          }));

          // 상세주소 input 포커스
          setTimeout(() => {
            detailAddressRef.current?.focus();
          }, 0);
        },
      }).open();
    } else {
      alert('주소 검색 스크립트가 로드되지 않았습니다.');
    }
  };

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    navigate({ pathname: URL.ADMIN_VENUE });
  };

  // 등록/수정 버튼 클릭
  const handleOnUpdate = async () => {
    try {
      const requestData = {};

      for (let key in venueInfo) {
        if (venueInfo[key] !== null && venueInfo[key] !== undefined) {
          requestData[key] = venueInfo[key];
        }
      }

      if (!formValidatorVenue(requestData)) return;

      let apiUrl = '';
      if (modeInfo.mode === CODE.MODE_CREATE) {
        apiUrl = '/api/registerVenue.do';
      } else {
        apiUrl = '/api/updateVenue.do';
        requestData.venueId = props.venueId; // 수정 시 ID 추가
      }

      const resp = await ApiFetch.requestFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        navigate({ pathname: URL.ADMIN_VENUE });
      } else {
        alert('경기장소 등록/수정 실패');
      }
    } catch (e) {
      console.error(e);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 경기장소 정보 조회 (수정 모드일 때)
  const fetchVenueInfo = async () => {
    try {
      const resp = await ApiFetch.requestFetch(
        `/api/retrieveVenueDetail.do?venueId=${props.venueId}`,
        { method: 'GET' },
      );

      if (resp && resp.result) {
        setVenueInfo({
          ...resp.result.venue,
        });
      }
    } catch (e) {
      console.error(e);
      alert('경기장소 정보를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    initMode();
    if (props.mode === CODE.MODE_MODIFY && props.venueId) {
      fetchVenueInfo();
    }
  }, [props.mode, props.venueId]);

  return (
    <main className="flex-1 bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">
          경기장소 {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
        </h3>

        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full table-fixed bg-white">
              <tbody className="text-gray-900 text-sm font-medium">
                {/* 장소명 */}
                <tr className="border-b border-gray-200">
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    장소명
                  </th>

                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-64 px-3 bg-gray-100 rounded"
                      type="text"
                      value={venueInfo.venueNm || ''}
                      onChange={e =>
                        setVenueInfo(prev => ({
                          ...prev,
                          venueNm: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>

                {/* 주소 */}
                <tr className="border-b border-gray-200">
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    주소
                  </th>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-3">
                      {/* 우편번호 + 버튼 */}
                      <div className="flex gap-3">
                        <input
                          className="h-10 w-40 px-3 bg-gray-100 rounded"
                          value={venueInfo.postcode || ''}
                          readOnly
                          placeholder="우편번호"
                        />

                        <Button
                          className="h-10 px-4 bg-black text-white rounded"
                          onClick={handleOpenDaumPostCode}
                        >
                          주소 검색
                        </Button>
                      </div>

                      <input
                        className="h-10 w-96 px-3 bg-gray-100 rounded"
                        value={venueInfo.address || ''}
                        readOnly
                        placeholder="주소"
                      />

                      <input
                        className="h-10 w-96 px-3 bg-gray-100 rounded"
                        ref={detailAddressRef}
                        value={venueInfo.detailAddress || ''}
                        placeholder="상세주소"
                        onChange={e =>
                          setVenueInfo(prev => ({
                            ...prev,
                            detailAddress: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end mt-6 gap-4">
            <Button
              className="bg-gray-100 text-black px-8 py-2 rounded"
              onClick={handleOnCancel}
            >
              취소
            </Button>

            <Button
              className="bg-black text-white px-8 py-2 rounded"
              onClick={handleOnUpdate}
            >
              {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminVenueEdit;
