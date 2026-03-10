import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import { useParams } from 'react-router-dom';

const AdminTeamDetail = () => {
  const { teamId } = useParams();

  // 상태
  const [teamInfo, setTeamInfo] = useState({});
  const [coachInfo, setCoachInfo] = useState([]);
  const [playerInfo, setPlayerInfo] = useState([]);

  const retrieveList = useCallback(() => {
    console.log('useCallback 시작');

    const retrieveListURL =
      '/api/retrieveTeamDetail.do' + ApiFetch.getQueryString({ teamId });
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    ApiFetch.requestFetch(retrieveListURL, requestOptions, resp => {
      console.log('api 호출결과');
      console.log(resp);

      setTeamInfo(resp.result.team);
      setCoachInfo(resp.result.coaches || []);
      setPlayerInfo(resp.result.players || []);
    });
  }, [teamId]);

  useEffect(() => {
    retrieveList();
  }, [retrieveList]);

  // 지도자/임원 구분
  const coaches = coachInfo.filter(item => item.typeGbn === '2');
  const staffs = coachInfo.filter(item => item.typeGbn === '3');

  return (
    <main className="flex-1 bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <div className="flex items-center gap-x-3">
          <span className="w-10 h-10 rounded-full overflow-hidden border-1">
            <img src={teamInfo.storedFilePath} alt="univ" />
          </span>
          <h3 className="text-gray-700 text-3xl font-bold">
            {teamInfo.teamNm}
          </h3>
        </div>

        <div className="flex gap-8 mt-10">
          <div className="w-2/5">
            <div>
              <h2 className="text-gray-700 text-2xl font-bold">지도자</h2>
              <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
                <table className="w-[1280px]">
                  <thead>
                    <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                      <th className="px-4 py-3 font-medium">이름</th>
                      <th className="px-6 py-3 font-medium">직함</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                    {coaches.length > 0 ? (
                      coaches.map((coach, idx) => (
                        <tr className="border-b border-gray-200" key={idx}>
                          <td className="px-4 py-4">{coach.name}</td>
                          <td className="px-6 py-4">{coach.title}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>데이터 없음</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-gray-700 text-2xl font-bold">임원</h2>
              <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
                <table className="w-[1280px]">
                  <thead>
                    <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                      <th className="px-6 py-3 font-medium">이름</th>
                      <th className="px-6 py-3 font-medium">직함</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                    {staffs.length > 0 ? (
                      staffs.map((staff, idx) => (
                        <tr className="border-b border-gray-200" key={idx}>
                          <td className="px-6 py-4">{staff.name}</td>
                          <td className="px-6 py-4">{staff.title}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>데이터 없음</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-3/5">
            <h2 className="text-gray-700 text-2xl font-bold">선수</h2>
            <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
              <table className="w-[1280px]">
                <thead>
                  <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                    <th className="px-6 py-3 font-medium">배번</th>
                    <th className="px-6 py-3 font-medium">이름</th>
                    <th className="px-6 py-3 font-medium">포지션</th>
                    <th className="px-6 py-3 font-medium">학년</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                  {playerInfo.length > 0 ? (
                    playerInfo.map((player, idx) => (
                      <tr className="border-b border-gray-200" key={idx}>
                        <td className="px-6 py-4">{player.uniformNum}</td>
                        <td className="px-6 py-4">{player.name}</td>
                        <td className="px-6 py-4">{player.position}</td>
                        <td className="px-6 py-4">{player.grade}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>데이터 없음</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminTeamDetail;
