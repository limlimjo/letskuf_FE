import { useEffect, useRef, useState } from 'react';
import CODE from '../../../constants/code';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import URL from '../../../constants/url';
import * as ApiFetch from '../../../api/apiFetch';
import formValidator from '../../../utils/formValidator';

const AdminTeamEdit = props => {
  console.log('props 확인 : ', props);

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [teamInfo, setTeamInfo] = useState({ teamFile: [] });
  const detailAddressRef = useRef(null);
  const navigate = useNavigate();

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: '등록',
          editURL: '/admin/team/create',
        });
        break;

      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: '수정',
          editURL: `/admin/team/modify/${props.teamId}`,
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
          var regionNm = data.sido; // 지역 추출 (시/도)

          //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져옴
          if (data.userSelectedType === 'R') {
            // 사용자가 도로명 주소를 선택했을 경우
            addr = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress;
          }
          // 우편번호와 주소 정보 세팅
          setTeamInfo(prev => ({
            ...prev,
            postcode: data.zonecode,
            address: addr,
            regionNm: regionNm,
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

  // 파일 선택 추가
  const handleFileChange = e => {
    const file = e.target.files[0];
    setTeamInfo(prev => ({
      ...prev,
      teamFile: file ? [file] : [],
    }));
  };

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    navigate({ pathname: URL.ADMIN_TEAM });
  };

  // 등록/수정 버튼 클릭
  const handleOnUpdate = async () => {
    console.log('등록 버튼');
    const formData = new FormData();
    for (let key in teamInfo) {
      if (key === 'teamFile') {
        if (teamInfo[key].length > 0) {
          // 파일이 있을 때
          teamInfo[key].forEach(file => {
            formData.append('teamFile', file);
          });
        } else {
          // 파일이 없을 때 빈 파일 추가
          formData.append('teamFile', new File([], ''));
        }
      } else if (teamInfo[key] !== null && teamInfo[key] !== undefined) {
        // 일반 필드들 처리
        formData.append(key, teamInfo[key]);
      }
    }

    // 유효성 검사
    if (formValidator(formData)) {
      console.log('formData 출력');
      console.log(formData);
      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // API 호출
      ApiFetch.requestFetch('/api/registerTeam.do', requestOptions, resp => {
        console.log('api 호출');
        console.log(resp);
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          navigate({ pathname: URL.ADMIN_TEAM });
        } else {
          console.error('error');
        }
      });
    }
  };

  useEffect(() => {
    initMode();
  }, []);

  return (
    <main className="flex-1 bg-gray-200">
      <div className="container mx-auto px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">
          팀 {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
        </h3>
        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border-b border-gray-200">
            <table className="w-full">
              <tbody className="bg-white text-gray-900 text-sm font-medium">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                    팀명
                  </th>
                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-64 pl-2 bg-gray-100 rounded"
                      type="text"
                      required
                      value={teamInfo.teamNm || ''}
                      onChange={e =>
                        setTeamInfo(prev => ({
                          ...prev,
                          teamNm: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                    창단년도
                  </th>
                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-64 pl-2 bg-gray-100 rounded"
                      type="number"
                      required
                      min="1800"
                      max={new Date().getFullYear}
                      value={teamInfo.foundYear || ''}
                      onChange={e =>
                        setTeamInfo(prev => ({
                          ...prev,
                          foundYear: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                    주소
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <input
                          className="h-10 w-64 pl-2 mb-3 bg-gray-100 rounded"
                          type="text"
                          value={teamInfo.postcode || ''}
                          onChange={e =>
                            setTeamInfo(prev => ({
                              ...prev,
                              postcode: e.target.value,
                            }))
                          }
                          id="postcode"
                          name="postcode"
                          placeholder="우편번호"
                          readOnly="readonly"
                        />
                        <input
                          className="h-10 w-64 pl-2 mb-3 bg-gray-100 rounded"
                          type="text"
                          value={teamInfo.address || ''}
                          onChange={e =>
                            setTeamInfo(prev => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          id="address"
                          name="address"
                          placeholder="주소"
                          readOnly="readonly"
                        />
                        <input
                          className="h-10 w-64 pl-2 bg-gray-100 rounded"
                          type="text"
                          ref={detailAddressRef}
                          value={teamInfo.detailAddress || ''}
                          onChange={e =>
                            setTeamInfo(prev => ({
                              ...prev,
                              detailAddress: e.target.value,
                            }))
                          }
                          id="detailAddress"
                          name="detailAddress"
                          placeholder="상세주소"
                        />
                        <input
                          type="hidden"
                          value={teamInfo.regionNm || ''}
                          name="regionNm"
                        />
                      </div>
                      <input
                        className="h-10 w-30 pl-2 bg-black text-white rounded"
                        type="button"
                        onClick={handleOpenDaumPostCode}
                        value="주소 검색"
                      />
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                    사진 첨부
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {teamInfo.teamFile && teamInfo.teamFile.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        선택된 파일: {teamInfo.teamFile[0].name}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-end mt-6 gap-5">
            <Button
              className="bg-gray-100 text-black px-10 py-2 rounded"
              onClick={handleOnCancel}
            >
              취소
            </Button>
            <Button
              className="bg-black text-white px-10 py-2 rounded"
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

export default AdminTeamEdit;
