import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import Button from '../../../components/Button';
import CODE from '../../../constants/code';
import { useParams } from 'react-router-dom';

const AdminLeagueDetail = () => {
  const { leagueId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [leagueInfo, setLeagueInfo] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    startDate: '',
    endDate: '',
  });

  const retrieveList = useCallback(() => {
    const retrieveListURL =
      '/api/retrieveLeagueDetail.do' + ApiFetch.getQueryString({ leagueId });

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    ApiFetch.requestFetch(retrieveListURL, requestOptions, resp => {
      setLeagueInfo(resp.result.league || {});
    });
  }, [leagueId]);

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    setIsEditing(false);
  };

  // 리그/대회 수정 버튼 클릭
  const handleEditOrSave = useCallback(() => {
    if (isEditing) {
      const sendData = { ...formData, leagueId };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(sendData),
      };

      ApiFetch.requestFetch('/api/updateLeague.do', requestOptions, resp => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          alert('리그/대회 정보가 수정되었습니다.');
          setIsEditing(false);
          retrieveList();
        } else {
          alert('리그/대회 정보 수정 실패');
        }
      });
    } else {
      setFormData(leagueInfo);
      setIsEditing(true);
    }
  }, [isEditing, formData, leagueId, leagueInfo, retrieveList]);

  useEffect(() => {
    retrieveList();
  }, [retrieveList]);

  useEffect(() => {
    if (!isEditing && leagueInfo?.leagueId) {
      setFormData({
        name: leagueInfo.name || '',
        region: leagueInfo.region || '',
        startDate: leagueInfo.startDate || '',
        endDate: leagueInfo.endDate || '',
      });
    }
  }, [leagueInfo, isEditing]);

  return (
    <main className="bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold mb-6">
          리그/대회 관리
        </h3>

        {/* 리그/대회 수정 */}
        <div>
          <h2 className="text-gray-700 text-2xl font-bold">리그/대회 수정</h2>
          <div className="flex flex-col gap-6 bg-white p-6 mt-4 rounded-lg shadow">
            {/* 리그명 */}
            <div className="flex items-center">
              <span className="font-bold w-32">리그/대회명</span>

              <input
                className="h-10 w-130 px-6 rounded bg-gray-100"
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            {/* 지역 */}
            <div className="flex items-center">
              <span className="font-bold w-32">지역</span>

              <select
                className="h-10 w-56 px-6 bg-gray-100 rounded"
                value={formData.region}
                onChange={e =>
                  setFormData({ ...formData, region: e.target.value })
                }
                disabled={!isEditing}
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
            </div>

            {/* 기간 */}
            <div className="flex items-center">
              <span className="font-bold w-32">기간</span>

              {isEditing ? (
                <>
                  <input
                    className="h-10 w-56 px-6 rounded bg-gray-100 text-center"
                    type="date"
                    value={formData.startDate}
                    onChange={e =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />

                  <span className="mx-2">~</span>

                  <input
                    className="h-10 w-56 px-6 rounded bg-gray-100 text-center"
                    type="date"
                    value={formData.endDate}
                    onChange={e =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </>
              ) : (
                <span className="w-56 px-6 py-2 bg-gray-100 rounded">
                  {leagueInfo.startDate && leagueInfo.endDate
                    ? `${leagueInfo.startDate.replace(/-/g, '.')} ~ ${leagueInfo.endDate.replace(/-/g, '.')}`
                    : '기간 없음'}
                </span>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-4">
              {isEditing && (
                <Button
                  className="bg-gray-100 text-black px-8 py-2 rounded"
                  onClick={handleOnCancel}
                >
                  취소
                </Button>
              )}
              <Button
                className="bg-black text-white px-8 py-2 rounded"
                onClick={handleEditOrSave}
              >
                {isEditing ? '저장' : '수정'}
              </Button>
            </div>
          </div>
        </div>

        {/* 경기장 등록 및 수정 */}
        <div className="mt-10">
          <h2 className="text-gray-700 text-2xl font-bold">
            경기장 등록 및 수정
          </h2>

          <div className="flex flex-col gap-4 mt-4 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <span className="font-bold w-32">장소명</span>
              <input
                className="h-10 w-60 px-2 rounded bg-gray-100"
                type="text"
              />
            </div>

            <div className="flex items-center">
              <span className="font-bold w-32">주소</span>
              <input
                className="h-10 w-80 px-2 rounded bg-gray-100"
                type="text"
              />
            </div>

            <div className="flex justify-end">
              <Button className="bg-black text-white px-8 py-2 rounded">
                등록
              </Button>
            </div>
          </div>

          {/* 경기장 목록 */}
          <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">No.</th>
                  <th className="px-6 py-3 font-medium">장소명</th>
                  <th className="px-6 py-3 font-medium">주소</th>
                  <th className="px-6 py-3 font-medium">관리</th>
                </tr>
              </thead>
              {/* TODO: 수정 필요한 부분 (가상 데이터) */}
              <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">남산타워 운동장 제1구장</td>
                  <td className="px-6 py-4">서울 용산구 남산공원길 105</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 text-xs rounded font-semibold hover:bg-green-200 mr-2">
                      수정
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 text-xs rounded hover:bg-red-200">
                      삭제
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLeagueDetail;
