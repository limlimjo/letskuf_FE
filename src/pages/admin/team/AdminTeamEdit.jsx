import { useEffect, useRef, useState } from 'react';
import CODE from '../../../constants/code';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import URL from '../../../constants/url';
import * as ApiFetch from '../../../api/apiFetch';
import formValidatorTeam from '../../../utils/formValidatorTeam';

const AdminTeamEdit = props => {
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [teamInfo, setTeamInfo] = useState({ teamFile: [] });
  const [preview, setPreview] = useState(null);
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
          editURL: `/admin/team/${props.teamId}/modify`,
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

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    navigate({ pathname: URL.ADMIN_TEAM });
  };

  // 등록/수정 버튼 클릭
  const handleOnUpdate = async () => {
    try {
      const formData = new FormData();

      for (let key in teamInfo) {
        if (key === 'teamId') continue;

        if (key === 'teamFile') {
          if (teamInfo[key].length > 0) {
            teamInfo[key].forEach(file => {
              formData.append('teamFile', file);
            });
          } else {
            formData.append('teamFile', new File([], ''));
          }
        } else if (teamInfo[key] !== null && teamInfo[key] !== undefined) {
          formData.append(key, teamInfo[key]);
        }
      }

      if (!formValidatorTeam(formData)) return;

      let apiUrl = '';
      if (modeInfo.mode === CODE.MODE_CREATE) {
        apiUrl = '/api/registerTeam.do';
      } else {
        apiUrl = '/api/updateTeam.do';
        formData.append('teamId', props.teamId);
      }

      const resp = await ApiFetch.requestFetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        navigate({ pathname: URL.ADMIN_TEAM });
      } else {
        alert('저장 실패');
      }
    } catch (e) {
      console.error(e);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 팀 정보 조회 (수정 모드일 때)
  const fetchTeamInfo = async () => {
    try {
      const resp = await ApiFetch.requestFetch(
        `/api/retrieveUpdateTeamDetail.do?teamId=${props.teamId}`,
        { method: 'GET' },
      );

      if (resp && resp.result) {
        setTeamInfo({
          ...resp.result.team,
          teamFile: [],
          originalFileName: resp.result.teamFile?.originalFileName || '',
          storedFileName: resp.result.teamFile?.storedFileName || '',
        });
      }
    } catch (e) {
      console.error(e);
      alert('팀 정보를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    initMode();
    if (props.mode === CODE.MODE_MODIFY && props.teamId) {
      fetchTeamInfo();
    }
  }, []);

  return (
    <main className="flex-1 bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">
          팀 {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
        </h3>

        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full table-fixed bg-white">
              <tbody className="text-gray-900 text-sm font-medium">
                {/* 팀명 */}
                <tr className="border-b border-gray-200">
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    팀명
                  </th>

                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-64 px-3 bg-gray-100 rounded"
                      type="text"
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

                {/* 창단년도 */}
                <tr className="border-b border-gray-200">
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    창단년도
                  </th>

                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-64 px-3 bg-gray-100 rounded"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
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
                          value={teamInfo.postcode || ''}
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
                        value={teamInfo.address || ''}
                        readOnly
                        placeholder="주소"
                      />

                      <input
                        className="h-10 w-96 px-3 bg-gray-100 rounded"
                        ref={detailAddressRef}
                        value={teamInfo.detailAddress || ''}
                        placeholder="상세주소"
                        onChange={e =>
                          setTeamInfo(prev => ({
                            ...prev,
                            detailAddress: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </td>
                </tr>

                {/* 이미지 */}
                <tr>
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    사진 첨부
                  </th>

                  <td className="px-6 py-4">
                    <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200">
                      파일 선택
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {teamInfo.teamFile?.length > 0 ? (
                      <div className="mt-3">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-32 h-32 object-cover rounded border"
                        />

                        <p className="text-sm text-gray-600 mt-1">
                          {teamInfo.teamFile[0].name}
                        </p>
                      </div>
                    ) : teamInfo.storedFileName ? (
                      <div className="mt-3">
                        <img
                          src={teamInfo.storedFileName}
                          alt={teamInfo.originalFileName}
                          className="w-32 h-32 object-cover rounded border"
                        />

                        <p className="text-xs text-gray-500">
                          현재 등록된 이미지
                        </p>
                      </div>
                    ) : null}
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

export default AdminTeamEdit;
