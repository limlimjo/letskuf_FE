import { useEffect, useState } from 'react';
import CODE from '../../../constants/code';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import URL from '../../../constants/url';
import * as ApiFetch from '../../../api/apiFetch';
import formValidatorLeague from '../../../utils/formValidatorLeague';

const AdminLeagueEdit = props => {
  console.log('props 확인 : ', props);

  const [tabType, setTabType] = useState('LEAGUE');
  const [modeInfo, setModeInfo] = useState({ mode: props.mode });
  const [leagueInfo, setLeagueInfo] = useState({});
  const navigate = useNavigate();

  const initMode = () => {
    switch (props.mode) {
      case CODE.MODE_CREATE:
        setModeInfo({
          ...modeInfo,
          modeTitle: '등록',
          editURL: '/admin/league/create',
        });
        break;

      case CODE.MODE_MODIFY:
        setModeInfo({
          ...modeInfo,
          modeTitle: '수정',
          editURL: `/admin/league/${props.leagueId}/modify`,
        });
        break;
    }
  };

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    navigate({ pathname: URL.ADMIN_LEAGUE });
  };

  // 등록/수정 버튼 클릭
  const handleOnUpdate = async () => {
    console.log('등록 버튼');
    const requestData = {};
    for (let key in leagueInfo) {
      if (leagueInfo[key] !== null && leagueInfo[key] !== undefined) {
        // 일반 필드들 처리
        requestData[key] = leagueInfo[key];
      }
    }
    requestData.type = tabType;

    // 유효성 검사
    if (formValidatorLeague(requestData, tabType)) {
      console.log('requestData 출력');
      console.log(requestData);

      let apiUrl = '';
      if (modeInfo.mode === CODE.MODE_CREATE) {
        apiUrl = '/api/registerLeague.do';
      } else if (modeInfo.mode === CODE.MODE_MODIFY) {
        apiUrl = '/api/updateLeague.do';
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      };

      // API 호출
      ApiFetch.requestFetch(apiUrl, requestOptions, resp => {
        console.log('api 호출');
        console.log(resp);
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          navigate({ pathname: URL.ADMIN_LEAGUE });
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
    <main className="bg-gray-200 min-h-screen">
      <div className="w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">
          리그/대회 {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
        </h3>

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
              setLeagueInfo({});
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
              setLeagueInfo({});
            }}
          >
            대회
          </Button>
        </div>

        {/* 테이블 */}
        <div className="mt-8">
          <div className="shadow rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full bg-white">
              <tbody className="text-gray-900 text-sm font-medium">
                {/* 리그명 */}
                <tr className="border-b border-gray-200">
                  <th className="w-60 px-6 py-3 bg-gray-100 text-sm text-center text-gray-500">
                    {tabType === 'LEAGUE' ? '리그명' : '대회명'}
                  </th>

                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-130 pl-2 bg-gray-100 rounded"
                      type="text"
                      value={leagueInfo.name || ''}
                      onChange={e =>
                        setLeagueInfo(prev => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </td>
                </tr>

                {/* 지역 */}
                <tr className="border-b border-gray-200">
                  <th className="w-60 px-6 py-3 bg-gray-100 text-sm text-center text-gray-500">
                    지역
                  </th>

                  <td className="px-6 py-4">
                    <select
                      className="h-10 w-40 pl-2 bg-gray-100 rounded"
                      value={leagueInfo.region || ''}
                      onChange={e =>
                        setLeagueInfo(prev => ({
                          ...prev,
                          region: e.target.value,
                        }))
                      }
                    >
                      <option value="">선택</option>
                      <option value="전국">전국</option>
                      <option value="서울">서울</option>
                      <option value="인천">인천</option>
                      <option value="경기">경기</option>
                      <option value="강원">강원</option>
                      <option value="경북">경북</option>
                      <option value="경남">경남</option>
                      <option value="전북">전북</option>
                      <option value="전남">전남</option>
                      <option value="제주">제주</option>
                    </select>
                  </td>
                </tr>

                {/* 기간 */}
                <tr>
                  <th className="w-60 px-6 py-3 bg-gray-100 text-sm text-center text-gray-500">
                    기간
                  </th>

                  <td className="px-6 py-4 flex items-center gap-3">
                    <input
                      className="h-10 w-56 px-3 bg-gray-100 rounded"
                      type="date"
                      value={leagueInfo.startDate || ''}
                      onChange={e =>
                        setLeagueInfo(prev => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />

                    <span>부터</span>

                    <input
                      className="h-10 w-56 px-3 bg-gray-100 rounded"
                      type="date"
                      value={leagueInfo.endDate || ''}
                      onChange={e =>
                        setLeagueInfo(prev => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />

                    <span>까지</span>
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

export default AdminLeagueEdit;
