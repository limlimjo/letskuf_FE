import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import Button from '../../../components/Button';
import CODE from '../../../constants/code';
import { useParams } from 'react-router-dom';

const AdminLeagueDetail = () => {
  const { leagueId } = useParams();

  // 상태
  const [isEditing, setIsEditing] = useState(false);
  const [leagueInfo, setLeagueInfo] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    startDate: '',
    endDate: '',
  }); // 수정할 때 사용할 formData 상태

  const retrieveList = useCallback(() => {
    console.log('useCallback 시작');

    const retrieveListURL =
      '/api/retrieveLeagueDetail.do' + ApiFetch.getQueryString({ leagueId });
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    ApiFetch.requestFetch(retrieveListURL, requestOptions, resp => {
      console.log('api 호출결과');
      console.log(resp);

      setLeagueInfo(resp.result.league || {});
    });
  }, [leagueId]);

  // 수정/등록 버튼 클릭 핸들러
  const handleEditOrSave = useCallback(() => {
    if (isEditing) {
      // 수정 API 호출
      const sendData = { ...formData, leagueId };
      const updateLeagueURL = '/api/updateLeague.do';
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(sendData),
      };
      ApiFetch.requestFetch(
        updateLeagueURL,
        requestOptions,
        resp => {
          console.log('수정 결과: ', resp);
          if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
            alert('리그/대회 정보가 수정되었습니다.');
            setIsEditing(false);
            retrieveList();
          } else {
            alert('리그/대회 정보 수정에 실패했습니다. 다시 시도해주세요.');
            setIsEditing(true);
          }
        },
        [isEditing, formData, retrieveList],
      );
    } else {
      setFormData(leagueInfo);
      setIsEditing(true); // 수정 모드로 변환
    }
  });

  useEffect(() => {
    retrieveList();
  }, [retrieveList]);

  useEffect(() => {
    // leagueInfo가 변경될 때, 수정 모드가 아닐 때만 formData를 동기화
    if (!isEditing && leagueInfo && leagueInfo.leagueId) {
      setFormData({
        name: leagueInfo.name || '',
        region: leagueInfo.region || '',
        startDate: leagueInfo.startDate || '',
        endDate: leagueInfo.endDate || '',
      });
    }
  }, [leagueInfo, isEditing]);

  return (
    <main className="flex-1 bg-gray-200">
      <div className="container mx-auto px-10 py-8">
        {isEditing ? (
          <input
            className="h-12 ml-2 px-4 py-1 rounded bg-gray-200 text-3xl font-bold text-gray-700"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        ) : (
          <h3 className="text-gray-700 text-3xl font-bold">
            {leagueInfo.name}
          </h3>
        )}

        <div className="mt-8 flex gap-6 bg-white p-6 rounded-lg shadow items-center justify-center">
          <div>
            <span className="font-bold px-10">기간</span>
            {isEditing ? (
              <>
                <input
                  className="h-10 ml-2 px-4 py-1 rounded bg-gray-200 text-center"
                  type="date"
                  value={formData.startDate}
                  onChange={e =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
                <span className="mx-2"> ~ </span>
                <input
                  className="h-10 px-4 py-1 rounded bg-gray-200 text-center"
                  type="date"
                  value={formData.endDate}
                  onChange={e =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </>
            ) : (
              <span className="h-10 ml-2 px-10 py-1 rounded bg-gray-200 text-center inline-flex items-center">
                {leagueInfo.startDate && leagueInfo.endDate
                  ? `${leagueInfo.startDate.replace(/-/g, '.')} ~ ${leagueInfo.endDate.replace(/-/g, '.')}`
                  : '기간 없음'}
              </span>
            )}
          </div>
          <div>
            <span className="font-bold px-10">지역</span>
            <select
              className="h-10 w-32 pl-2 bg-gray-200 rounded"
              value={formData.region}
              onChange={e =>
                setFormData({ ...formData, region: e.target.value })
              }
              disabled={!isEditing}
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
          </div>
          <Button
            className="bg-black text-white px-10 py-2 rounded ml-auto"
            onClick={handleEditOrSave}
          >
            {isEditing ? '저장' : '수정'}
          </Button>
        </div>
        <div className="mt-10">
          <h2 className="text-gray-700 text-2xl font-bold">경기 장소</h2>
          <div className="mt-4 flex gap-6 bg-white p-6 rounded-lg shadow items-center justify-center">
            <div>
              <span className="font-bold px-10">장소명</span>
              <input
                className="h-10 w-60 ml-2 px-2 py-1 rounded bg-gray-200"
                type="text"
                value=""
              />
            </div>
            <div>
              <span className="font-bold px-10">주소</span>
              <input
                className="h-10 w-80 ml-2 px-2 py-1 rounded bg-gray-200"
                type="text"
                value=""
              />
            </div>
            <Button className="bg-black text-white px-10 py-2 rounded ml-auto">
              등록
            </Button>
          </div>
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
              <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                {/* Example data, replace with actual data */}
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">남산타워 운동장 제1구장</td>
                  <td className="px-6 py-4">서울 용산구 남산공원길 105</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 text-xs rounded-full font-semibold hover:bg-red-200 transition">
                      삭제
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">2</td>
                  <td className="px-6 py-4">남산타워 운동장 제1구장</td>
                  <td className="px-6 py-4">서울 용산구 남산공원길 105</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 text-xs rounded-full font-semibold hover:bg-red-200 transition">
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
