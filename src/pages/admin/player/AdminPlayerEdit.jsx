import { useEffect, useState } from 'react';
import CODE from '../../../constants/code';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import URL from '../../../constants/url';
import * as ApiFetch from '../../../api/apiFetch';
import Select from 'react-select';
import formValidatorCoach from '../../../utils/formValidatorCoach';

const AdminPlayerEdit = props => {
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [teamOptions, setTeamOptions] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({ file: [] });
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: '등록',
        });

        break;

      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: '수정',
        });

        break;
    }
  };

  // 파일 선택 추가
  const handleFileChange = e => {
    const file = e.target.files[0];
    setPlayerInfo(prev => ({
      ...prev,
      file: file ? [file] : [],
    }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    if (props.playerId) {
      navigate({ pathname: URL.ADMIN_PLAYER });
    } else if (props.coachId) {
      navigate({ pathname: URL.ADMIN_PLAYER_STAFF });
    } else {
      navigate({ pathname: URL.ADMIN_PLAYER });
    }
  };

  // 등록/수정 버튼 클릭
  const handleOnUpdate = async () => {
    console.log('등록 버튼');
    const formData = new FormData();
    for (let key in playerInfo) {
      if (key === 'playerId') continue; // playerId는 루프에서 제외
      if (key === 'coachId') continue; // coachId는 루프에서 제외
      if (key === 'file') {
        if (playerInfo[key].length > 0) {
          // 파일이 있을 때
          playerInfo[key].forEach(file => {
            formData.append('file', file);
          });
        } else {
          // 파일이 없을 때 빈 파일 추가
          formData.append('file', new File([], ''));
        }
      } else if (playerInfo[key] !== null && playerInfo[key] !== undefined) {
        // 일반 필드들 처리
        formData.append(key, playerInfo[key]);
      }
    }

    // 유효성 검사
    if (formValidatorCoach(formData, playerInfo.typeGbn)) {
      console.log('formData 출력');
      console.log(formData);

      let apiUrl = '';
      if (modeInfo.mode === CODE.MODE_CREATE) {
        if (playerInfo.typeGbn === '1') {
          apiUrl = '/api/registerPlayer.do';
        } else if (playerInfo.typeGbn === '2' || playerInfo.typeGbn === '3') {
          apiUrl = '/api/registerCoach.do';
        }
      } else if (modeInfo.mode === CODE.MODE_MODIFY) {
        if (playerInfo.typeGbn === '1') {
          apiUrl = '/api/updatePlayer.do';
          formData.append('playerId', props.playerId);
        } else if (playerInfo.typeGbn === '2' || playerInfo.typeGbn === '3') {
          apiUrl = '/api/updateCoach.do';
          formData.append('coachId', props.coachId);
        }
      }

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // API 호출
      ApiFetch.requestFetch(apiUrl, requestOptions, resp => {
        console.log('api 호출');
        console.log(resp);
        if (playerInfo.typeGbn === '1') {
          // 선수 등록/수정
          //console.log('선수 등록/수정 완료');
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            navigate({ pathname: URL.ADMIN_PLAYER });
          } else {
            console.error('error');
          }
        } else if (playerInfo.typeGbn === '2' || playerInfo.typeGbn === '3') {
          // 코칭스태프/임원 등록/수정
          //console.log('코칭스태프/임원 등록/수정 완료');
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            navigate({ pathname: URL.ADMIN_PLAYER_STAFF });
          } else {
            console.error('error');
          }
        }
      });
    }
  };

  // 선수 정보 조회 (수정 모드일 때)
  const fetchPlayerInfo = async () => {
    try {
      console.log('선수 정보 조회 시작');
      ApiFetch.requestFetch(
        `/api/retrieveUpdatePlayerDetail.do?playerId=${props.playerId}`,
        { method: 'GET' },
        resp => {
          if (resp && resp.result) {
            setPlayerInfo({
              ...resp.result.player,
              file: [],
              originalFileName: resp.result.file?.originalFileName || '', // 파일명만 저장
              storedFileName: resp.result.file?.storedFileName || '', // 이미지 URL 저장
            });
          }
        },
      );
      console.log('playerInfo 출력:', playerInfo);
    } catch (e) {
      alert('선수 정보를 불러오지 못했습니다.');
    }
  };

  // 코칭스태프/임원 정보 조회 (수정 모드일 때)
  const fetchStaffInfo = async () => {
    try {
      console.log('코칭스태프/임원 정보 조회 시작');
      ApiFetch.requestFetch(
        `/api/retrieveUpdateCoachDetail.do?coachId=${props.coachId}`,
        { method: 'GET' },
        resp => {
          if (resp && resp.result) {
            setPlayerInfo({
              ...resp.result.coach,
              file: [],
              originalFileName: resp.result.file?.originalFileName || '', // 파일명만 저장
              storedFileName: resp.result.file?.storedFileName || '', // 이미지 URL 저장
            });
          }
        },
      );
    } catch (e) {
      alert('코칭스태프/임원 정보를 불러오지 못했습니다.');
    }
  };

  // 팀 목록 조회
  useEffect(() => {
    ApiFetch.requestFetch(
      '/api/retrieveTeamList.do',
      { method: 'GET' },
      resp => {
        console.log('팀 목록 조회 결과:', resp);
        if (resp && resp.result) {
          setTeamOptions(
            resp.result.resultList.map(team => ({
              value: team.teamId,
              label: team.teamNm,
            })),
          );
        }
      },
    );
  }, []);

  useEffect(() => {
    initMode();
    if (props.mode === CODE.MODE_MODIFY && props.playerId) {
      fetchPlayerInfo();
    } else if (props.mode === CODE.MODE_MODIFY && props.coachId) {
      fetchStaffInfo();
    }
  }, []);

  return (
    <main className="bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">
          선수단 {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
        </h3>

        <div className="mt-8">
          <div className="shadow rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full table-fixed bg-white">
              <colgroup>
                <col className="w-40" />
                <col />
                <col className="w-40" />
                <col />
              </colgroup>
              <tbody className="text-gray-900 text-sm font-medium">
                {/* 이름 */}
                <tr className="border-b border-gray-200">
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    이름
                  </th>

                  <td colSpan={3} className="px-6 py-4">
                    <input
                      className="h-10 w-64 px-3 bg-gray-100 rounded"
                      type="text"
                      value={playerInfo.name || ''}
                      onChange={e =>
                        setPlayerInfo(prev => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>

                {/* 생년월일 */}
                <tr className="border-b border-gray-200">
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    생년월일
                  </th>

                  <td colSpan={3} className="px-6 py-4">
                    <input
                      className="h-10 w-64 px-3 bg-gray-100 rounded"
                      type="date"
                      value={playerInfo.birthDate || ''}
                      onChange={e =>
                        setPlayerInfo(prev => ({
                          ...prev,
                          birthDate: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>

                {/* 팀 + 분류 */}
                <tr className="border-b border-gray-200">
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    소속팀
                  </th>

                  <td className="px-6 py-4">
                    <Select
                      className="w-64"
                      options={teamOptions}
                      value={
                        teamOptions.find(
                          opt => opt.value === playerInfo.teamId,
                        ) || null
                      }
                      onChange={selected =>
                        setPlayerInfo(prev => ({
                          ...prev,
                          teamId: selected ? selected.value : '',
                          teamNm: selected ? selected.label : '',
                        }))
                      }
                      placeholder="팀명을 검색하세요"
                      isClearable
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      styles={{
                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </td>

                  <th className="w-40 px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500">
                    분류
                  </th>

                  <td className="px-6 py-4">
                    <select
                      className="h-10 w-40 pl-2 bg-gray-100 rounded"
                      value={playerInfo.typeGbn || ''}
                      onChange={e =>
                        setPlayerInfo(prev => ({
                          ...prev,
                          typeGbn: e.target.value,
                          position: '',
                          grade: '',
                          uniformNum: '',
                          height: '',
                          weight: '',
                          title: '',
                        }))
                      }
                      disabled={props.mode === CODE.MODE_MODIFY}
                    >
                      <option value="">선택</option>
                      <option value="1">선수</option>
                      <option value="2">코칭스태프</option>
                      <option value="3">임원</option>
                    </select>
                  </td>
                </tr>

                {/* 선수일 때만 렌더링 */}
                {playerInfo.typeGbn === '1' && (
                  <>
                    <tr className="border-b border-gray-200">
                      <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                        선수정보
                      </th>

                      <td
                        colSpan={3}
                        className="px-6 py-4 flex gap-10 items-center"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm w-10">
                            포지션
                          </span>
                          <select
                            className="h-10 w-32 px-2 bg-gray-100 rounded"
                            value={playerInfo.position || ''}
                            onChange={e =>
                              setPlayerInfo(prev => ({
                                ...prev,
                                position: e.target.value,
                              }))
                            }
                          >
                            <option value="">선택</option>
                            <option value="FW">FW</option>
                            <option value="MF">MF</option>
                            <option value="DF">DF</option>
                            <option value="GK">GK</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm w-8">
                            학년
                          </span>

                          <select
                            className="h-10 w-24 px-2 bg-gray-100 rounded"
                            value={playerInfo.grade || ''}
                            onChange={e =>
                              setPlayerInfo(prev => ({
                                ...prev,
                                grade: e.target.value,
                              }))
                            }
                          >
                            <option value="">선택</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm w-8">
                            배번
                          </span>

                          <input
                            className="h-10 w-24 px-2 bg-gray-100 rounded"
                            type="number"
                            min="0"
                            step="1"
                            value={playerInfo.uniformNum || ''}
                            onChange={e => {
                              const value = e.target.value;
                              // 음수 입력 방지
                              if (value === '' || Number(value) >= 0) {
                                setPlayerInfo(prev => ({
                                  ...prev,
                                  uniformNum: value,
                                }));
                              }
                            }}
                          />
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200">
                      <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                        신체정보
                      </th>

                      <td
                        colSpan={3}
                        className="px-6 py-4 flex items-center gap-8"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-8">
                            신장
                          </span>
                          <input
                            className="h-10 w-24 px-2 bg-gray-100 rounded"
                            type="number"
                            min="0"
                            step="1"
                            value={playerInfo.height || ''}
                            onChange={e => {
                              const value = e.target.value;
                              // 음수 입력 방지
                              if (value === '' || Number(value) >= 0) {
                                setPlayerInfo(prev => ({
                                  ...prev,
                                  height: value,
                                }));
                              }
                            }}
                            placeholder="예) 180"
                          />
                          <span className="text-sm text-gray-500">cm</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 w-8">
                            체중
                          </span>
                          <input
                            className="h-10 w-24 px-2 bg-gray-100 rounded"
                            type="number"
                            min="0"
                            step="1"
                            value={playerInfo.weight || ''}
                            onChange={e => {
                              const value = e.target.value;
                              // 음수 입력 방지
                              if (value === '' || Number(value) >= 0) {
                                setPlayerInfo(prev => ({
                                  ...prev,
                                  weight: value,
                                }));
                              }
                            }}
                            placeholder="예) 75"
                          />
                          <span className="text-sm text-gray-500">kg</span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}

                {/* 코칭스태프/임원일 때만 렌더링 */}
                {(playerInfo.typeGbn === '2' || playerInfo.typeGbn === '3') && (
                  <tr className="border-b border-gray-200">
                    <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                      직책
                    </th>

                    <td colSpan={3} className="px-6 py-4">
                      <input
                        className="h-10 w-80 px-3 bg-gray-100 rounded"
                        type="text"
                        value={playerInfo.title || ''}
                        onChange={e =>
                          setPlayerInfo(prev => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="예) 감독, 코치, 트레이너 등"
                      />
                    </td>
                  </tr>
                )}

                {/* 사진 */}
                <tr>
                  <th className="w-40 px-6 py-3 bg-gray-100 text-center text-gray-500">
                    사진 첨부
                  </th>

                  <td colSpan={3} className="px-6 py-4">
                    <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200">
                      파일 선택
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {playerInfo.file?.length > 0 ? (
                      <div className="mt-3">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-32 h-32 object-cover rounded border"
                        />

                        <p className="text-sm text-gray-600 mt-1">
                          {playerInfo.file[0].name}
                        </p>
                      </div>
                    ) : playerInfo.storedFileName ? (
                      <div className="mt-3">
                        <img
                          src={playerInfo.storedFileName}
                          alt={playerInfo.originalFileName}
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

export default AdminPlayerEdit;
