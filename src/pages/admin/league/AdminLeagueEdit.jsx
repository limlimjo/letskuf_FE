import { useEffect, useRef, useState } from 'react';
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
          editURL: `/admin/league/modify/${props.leagueId}`,
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
    const formData = new FormData();
    for (let key in leagueInfo) {
      if (leagueInfo[key] !== null && leagueInfo[key] !== undefined) {
        // 일반 필드들 처리
        formData.append(key, leagueInfo[key]);
      }
    }
    formData.append('type', tabType);

    // 유효성 검사
    if (formValidatorLeague(formData, tabType)) {
      console.log('formData 출력');
      console.log(formData);
      let apiUrl = '/api/registerLeague.do';

      const requestOptions = {
        method: 'POST',
        body: formData,
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
    <main className="flex-1 bg-gray-200">
      <div className="container mx-auto px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">
          리그/대회 {modeInfo.mode === CODE.MODE_CREATE ? '등록' : '수정'}
        </h3>
        <div className="mt-8 flex gap-4">
          <Button
            className={`flex-1 py-2 ${
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
            className={`flex-1 py-2 ${
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
        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border-b border-gray-200">
            <table className="w-full bg-white">
              <tbody className="text-gray-900 text-sm font-medium">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                    {tabType === 'LEAGUE' ? '리그명' : '대회명'}
                  </th>
                  <td className="px-6 py-4">
                    <input
                      className="h-10 w-64 pl-2 bg-gray-100 rounded"
                      type="text"
                      required
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
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200 w-1/4">
                    지역
                  </th>
                  <td className="px-6 py-4 w-1/4">
                    <select
                      className="h-10 w-32 pl-2 bg-gray-100 rounded"
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
                      <option value="인천">인천 </option>
                      <option value="경기">경기</option>
                      <option value="강원">강원</option>
                      <option value="경북">경북</option>
                      <option value="경남">경남</option>
                      <option value="전북">전북</option>
                      <option value="전남">전남</option>
                      <option value="경북">경북</option>
                      <option value="경남">경남</option>
                      <option value="제주">제주</option>
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 font-bold bg-gray-100 text-sm text-center text-gray-500 border-b border-gray-200">
                    기간
                  </th>
                  <td className="px-6 py-4 flex gap-4 items-center">
                    <input
                      className="h-10 w-64 pl-2 bg-gray-100 rounded"
                      type="date"
                      value={leagueInfo.startDate || ''}
                      onChange={e =>
                        setLeagueInfo(prev => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />{' '}
                    부터
                    <input
                      className="h-10 w-64 pl-2 bg-gray-100 rounded"
                      type="date"
                      value={leagueInfo.endDate || ''}
                      onChange={e =>
                        setLeagueInfo(prev => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />{' '}
                    까지
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

export default AdminLeagueEdit;
