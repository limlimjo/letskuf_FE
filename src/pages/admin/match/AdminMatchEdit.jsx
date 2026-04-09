import { useEffect, useState } from 'react';
import CODE from '../../../constants/code';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import URL from '../../../constants/url';
import * as ApiFetch from '../../../api/apiFetch';
import Select from 'react-select';
import formValidatorMatch from '../../../utils/formValidatorMatch';

const AdminMatchEdit = props => {
  console.log('props 확인 : ', props);

  const [tabType, setTabType] = useState('LEAGUE');
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [matchInfo, setMatchInfo] = useState({
    uniformList: [
      { teamId: '', topColor: '', bottomColor: '', socksColor: '' }, // HOME
      { teamId: '', topColor: '', bottomColor: '', socksColor: '' }, // AWAY
    ],
  });
  const [leagueOptions, setLeagueOptions] = useState([]);
  const [venueOptions, setVenueOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const navigate = useNavigate();

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: '등록',
          editURL: '/admin/match/create',
        });
        break;

      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: '수정',
          editURL: `/admin/match/modify/${props.matchId}`,
        });
        break;
    }
  };

  // Home 팀 선택 함수
  const handleHomeTeamChange = selected => {
    setMatchInfo(prev => {
      const list = [...prev.uniformList];
      list[0].teamId = selected ? selected.value : '';

      return {
        ...prev,
        homeTeamId: selected ? selected.value : '',
        homeTeamNm: selected ? selected.label : '',
        uniformList: list,
      };
    });
  };

  // AWAY 팀 선택 함수
  const handleAwayTeamChange = selected => {
    setMatchInfo(prev => {
      const list = [...prev.uniformList];
      list[1].teamId = selected ? selected.value : '';

      return {
        ...prev,
        awayTeamId: selected ? selected.value : '',
        awayTeamNm: selected ? selected.label : '',
        uniformList: list,
      };
    });
  };

  // 유니폼 변경 공통 함수
  const handleUniformChange = (index, field, value) => {
    setMatchInfo(prev => {
      const list = [...prev.uniformList];
      list[index][field] = value;
      return { ...prev, uniformList: list };
    });
  };

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    navigate({ pathname: URL.ADMIN_MATCH });
  };

  // 등록/수정 버튼 클릭
  const handleOnUpdate = async () => {
    const requestBody = {
      ...matchInfo,
      type: tabType,
    };

    if (formValidatorMatch(requestBody, tabType)) {
      ApiFetch.requestFetch(
        '/api/registerMatch.do',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
        resp => {
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            navigate({ pathname: URL.ADMIN_MATCH });
          }
        },
      );
    }
  };
  // const handleOnUpdate = async () => {
  //   console.log('등록 버튼');
  //   const formData = new FormData();
  //   for (let key in matchInfo) {
  //     if (matchInfo[key] !== null && matchInfo[key] !== undefined) {
  //       // 일반 필드들 처리
  //       formData.append(key, matchInfo[key]);
  //     }
  //   }
  //   formData.append('type', tabType);

  //   // 유효성 검사
  //   if (formValidatorMatch(formData, tabType)) {
  //     console.log('formData 출력');
  //     console.log(formData);
  //     let apiUrl = '/api/registerMatch.do';

  //     const requestOptions = {
  //       method: 'POST',
  //       body: formData,
  //     };

  //     // API 호출
  //     ApiFetch.requestFetch(apiUrl, requestOptions, resp => {
  //       console.log('api 호출');
  //       console.log(resp);
  //       if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
  //         navigate({ pathname: URL.ADMIN_MATCH });
  //       } else {
  //         console.error('error');
  //       }
  //     });
  //   }
  // };

  // 리그/대회 조회
  useEffect(() => {
    const params = { type: tabType };
    ApiFetch.requestFetch(
      '/api/retrieveLeagueList.do' + ApiFetch.getQueryString(params),
      { method: 'GET' },
      resp => {
        console.log('리그 목록 조회 결과:', resp);
        if (resp && resp.result) {
          setLeagueOptions(
            resp.result.resultList.map(league => ({
              value: league.leagueId,
              label: league.name,
            })),
          );
        }
      },
    );

    // 탭 바뀌면 선택값 초기화
    setMatchInfo(prev => ({
      ...prev,
      leagueId: '',
      name: '',
      venueId: '',
      homeTeamId: '',
      homeTeamNm: '',
      awayTeamId: '',
      awayTeamNm: '',
    }));

    // 장소 옵션 초기화
    setVenueOptions([]);
  }, [tabType]);

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
    <main className="bg-gray-200 min-h-screen">
      <div className="w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">
          경기 {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
        </h3>

        <div className="mt-8">
          {/* 탭 */}
          <div className="mt-8 flex gap-4 w-[400px]">
            <Button
              className={`flex-1 py-2 rounded ${
                tabType === 'LEAGUE'
                  ? 'bg-black text-white font-bold'
                  : 'bg-gray-100 text-black'
              }`}
              onClick={() => {
                setTabType('LEAGUE');
              }}
            >
              리그
            </Button>

            <Button
              className={`flex-1 py-2 rounded ${
                tabType === 'TOURNAMENT'
                  ? 'bg-black text-white font-bold'
                  : 'bg-gray-100 text-black'
              }`}
              onClick={() => {
                setTabType('TOURNAMENT');
              }}
            >
              대회
            </Button>
          </div>
          <div className="flex flex-col mb-6 gap-6 bg-white p-6 mt-4 rounded-lg shadow">
            {/* 리그명 */}
            <div className="flex items-center">
              <span className="font-bold w-32">
                {tabType === 'LEAGUE' ? '리그명' : '대회명'}
              </span>
              <Select
                className="w-64"
                options={leagueOptions}
                value={
                  leagueOptions.find(opt => opt.value === matchInfo.leagueId) ||
                  null
                }
                onChange={selected => {
                  const leagueId = selected ? selected.value : '';

                  setMatchInfo(prev => ({
                    ...prev,
                    leagueId,
                    name: selected ? selected.label : '',
                    venueId: '',
                  }));

                  if (leagueId) {
                    ApiFetch.requestFetch(
                      `/api/retrieveLeagueVenue.do?leagueId=${leagueId}`,
                      { method: 'GET' },
                      resp => {
                        if (resp && resp.result) {
                          setVenueOptions(
                            resp.result.venue.map(v => ({
                              value: v.venueId,
                              label: v.name,
                            })),
                          );
                        }
                      },
                    );
                  } else {
                    setVenueOptions([]);
                  }
                }}
                placeholder="리그/대회명을 검색하세요"
                isClearable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>

            {/* 장소 */}
            <div className="flex items-center">
              <span className="font-bold w-32">장소</span>
              <Select
                className="w-64"
                options={venueOptions}
                value={
                  venueOptions.find(opt => opt.value === matchInfo.venueId) ||
                  null
                }
                onChange={selected =>
                  setMatchInfo(prev => ({
                    ...prev,
                    venueId: selected ? selected.value : '',
                  }))
                }
                placeholder="장소를 검색하세요"
                isClearable
                isDisabled={!matchInfo.leagueId}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>

            {/* 경기일시 */}
            <div className="flex items-center">
              <span className="font-bold w-32">경기일시</span>
              <div className="flex gap-3">
                <input
                  className="h-10 bg-gray-100 rounded px-2"
                  type="date"
                  value={matchInfo.matchDate || ''}
                  onChange={e =>
                    setMatchInfo(prev => ({
                      ...prev,
                      matchDate: e.target.value,
                    }))
                  }
                />
                <input
                  className="h-10 bg-gray-100 rounded px-2"
                  type="time"
                  value={matchInfo.kickoffTime || ''}
                  onChange={e =>
                    setMatchInfo(prev => ({
                      ...prev,
                      kickoffTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* HOME TEAM */}
          <div className="p-4 rounded mb-6 bg-white">
            <h4 className="font-bold mb-4">HOME 팀</h4>

            <div className="flex items-center">
              <span className="font-bold w-20">팀명</span>
              <Select
                className="w-64"
                options={teamOptions}
                value={
                  teamOptions.find(opt => opt.value === matchInfo.homeTeamId) ||
                  null
                }
                onChange={handleHomeTeamChange}
                placeholder="팀명을 검색하세요"
                isClearable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />

              <span className="font-bold w-20 ml-15">유니폼 색상</span>
              <div className="flex items-center gap-4">
                <span>상의</span>
                <input
                  className="w-16 h-8 px-2 bg-gray-200"
                  type="text"
                  onChange={e =>
                    handleUniformChange(0, 'topColor', e.target.value)
                  }
                />
                <span>하의</span>
                <input
                  className="w-16 h-8 px-2 bg-gray-200"
                  type="text"
                  onChange={e =>
                    handleUniformChange(0, 'bottomColor', e.target.value)
                  }
                />
                <span>스타킹</span>
                <input
                  className="w-16 h-8 px-2 bg-gray-200"
                  type="text"
                  onChange={e =>
                    handleUniformChange(0, 'socksColor', e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* AWAY TEAM */}
          <div className="p-4 rounded mb-6 bg-white">
            <h4 className="font-bold mb-4">AWAY 팀</h4>

            <div className="flex items-center">
              <span className="font-bold w-20">팀명</span>
              <Select
                className="w-64"
                options={teamOptions}
                value={
                  teamOptions.find(opt => opt.value === matchInfo.awayTeamId) ||
                  null
                }
                onChange={handleAwayTeamChange}
                placeholder="팀명을 검색하세요"
                isClearable
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />

              <span className="font-bold w-20 ml-15">유니폼 색상</span>
              <div className="flex items-center gap-4">
                <span>상의</span>
                <input
                  className="w-16 h-8 px-2 bg-gray-200"
                  type="text"
                  onChange={e =>
                    handleUniformChange(1, 'topColor', e.target.value)
                  }
                />
                <span>하의</span>
                <input
                  className="w-16 h-8 px-2 bg-gray-200"
                  type="text"
                  onChange={e =>
                    handleUniformChange(1, 'bottomColor', e.target.value)
                  }
                />
                <span>스타킹</span>
                <input
                  className="w-16 h-8 px-2 bg-gray-200"
                  type="text"
                  onChange={e =>
                    handleUniformChange(1, 'socksColor', e.target.value)
                  }
                />
              </div>
            </div>
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

export default AdminMatchEdit;
