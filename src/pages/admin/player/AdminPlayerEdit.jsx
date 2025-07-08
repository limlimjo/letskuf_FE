import { useEffect, useRef, useState } from 'react';
import CODE from '../../../constants/code';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import URL from '../../../constants/url';
import * as ApiFetch from '../../../api/apiFetch';
import Select from 'react-select';
import formValidatorCoach from '../../../utils/formValidatorCoach';

const AdminPlayerEdit = props => {
  console.log('props 확인 : ', props);

  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [teamOptions, setTeamOptions] = useState([]);
  const [playerInfo, setPlayerInfo] = useState({ file: [] });
  const navigate = useNavigate();

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: '등록',
          editURL: '/admin/player/create',
        });
        break;

      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: '수정',
          editURL: `/admin/player/modify/${props.playerId}`,
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
  };

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    navigate({ pathname: URL.ADMIN_PLAYER });
  };

  // 등록/수정 버튼 클릭
  const handleOnUpdate = async () => {
    console.log('등록 버튼');
    const formData = new FormData();
    for (let key in playerInfo) {
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
      let apiUrl = '/api/registerPlayer.do';
      if (playerInfo.typeGbn === '1') {
        apiUrl = '/api/registerPlayer.do';
      } else if (playerInfo.typeGbn === '2' || playerInfo.typeGbn === '3') {
        apiUrl = '/api/registerCoach.do';
      }

      const requestOptions = {
        method: 'POST',
        body: formData,
      };

      // API 호출
      ApiFetch.requestFetch(apiUrl, requestOptions, resp => {
        console.log('api 호출');
        console.log(resp);
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          navigate({ pathname: URL.ADMIN_PLAYER });
        } else {
          console.error('error');
        }
      });
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
  }, []);

  return (
    <main className="flex-1 bg-gray-200">
      <div className="container mx-auto px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">
          선수단 {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
        </h3>
        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border-b border-gray-200">
            <table className="w-full bg-white">
              <tbody className="text-gray-900 text-sm font-medium">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                    이름
                  </th>
                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-64 pl-2 bg-gray-100 rounded"
                      type="text"
                      required
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
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                    생년월일
                  </th>
                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-64 pl-2 bg-gray-100 rounded"
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
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200 w-1/4">
                    소속팀
                  </th>
                  <td className="px-6 py-4 w-1/4">
                    <Select
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
                      className="w-64"
                      menuPortalTarget={
                        typeof window !== 'undefined' ? document.body : null
                      }
                      menuPosition="fixed"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: '#f3f4f6', // Tailwind bg-gray-100
                          borderColor: state.isFocused ? '#a3a3a3' : '#e5e7eb', // Tailwind border-gray-200
                          boxShadow: state.isFocused
                            ? '0 0 0 1px #a3a3a3'
                            : 'none',
                          minHeight: '40px',
                          borderRadius: '0.375rem', // Tailwind rounded
                          '&:hover': {
                            borderColor: '#a3a3a3',
                          },
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? '#e5e7eb' // Tailwind bg-gray-200
                            : state.isFocused
                              ? '#f3f4f6' // Tailwind bg-gray-100
                              : '#fff',
                          color: '#111827', // Tailwind text-gray-900
                          fontWeight: state.isSelected ? 600 : 400,
                          fontSize: '0.875rem', // Tailwind text-sm
                        }),
                        menu: base => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        singleValue: base => ({
                          ...base,
                          color: '#111827', // Tailwind text-gray-900
                        }),
                        placeholder: base => ({
                          ...base,
                          color: '#6b7280', // Tailwind text-gray-500
                          fontSize: '0.875rem', // Tailwind text-sm
                        }),
                      }}
                    />
                  </td>
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200 w-1/4">
                    분류
                  </th>
                  <td className="px-6 py-4 w-1/4">
                    <select
                      className="h-10 w-32 pl-2 bg-gray-100 rounded"
                      value={playerInfo.typeGbn || ''}
                      onChange={e =>
                        setPlayerInfo(prev => ({
                          ...prev,
                          typeGbn: e.target.value,
                          // typeGbn 변경시 관련 필드 초기화
                          position: '',
                          grade: '',
                          uniformNum: '',
                          height: '',
                          weight: '',
                          title: '',
                        }))
                      }
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
                      <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                        포지션
                      </th>
                      <td className="px-6 py-4">
                        <select
                          className="h-10 w-32 pl-2 bg-gray-100 rounded"
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
                      </td>
                      <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                        학년
                      </th>
                      <td className="px-6 py-4">
                        <select
                          className="h-10 w-24 pl-2 bg-gray-100 rounded"
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
                      </td>
                      <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                        배번
                      </th>
                      <td className="px-6 py-4">
                        <input
                          className="h-10 w-20 pl-2 bg-gray-100 rounded"
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
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                        신장(cm)
                      </th>
                      <td className="px-6 py-4">
                        <input
                          className="h-10 w-24 pl-2 bg-gray-100 rounded"
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
                      </td>
                      <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                        체중(kg)
                      </th>
                      <td className="px-6 py-4">
                        <input
                          className="h-10 w-24 pl-2 bg-gray-100 rounded"
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
                      </td>
                    </tr>
                  </>
                )}
                {/* 코칭스태프/임원일 때만 렌더링 */}
                {(playerInfo.typeGbn === '2' || playerInfo.typeGbn === '3') && (
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                      직책
                    </th>
                    <td className="px-6 py-4">
                      <input
                        className="h-10 w-64 pl-2 bg-gray-100 rounded"
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
                    {playerInfo.teamFile && playerInfo.teamFile.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        선택된 파일: {playerInfo.teamFile[0].name}
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

export default AdminPlayerEdit;
