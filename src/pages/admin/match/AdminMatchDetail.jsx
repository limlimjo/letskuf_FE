import { useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import { Link, useNavigate } from 'react-router-dom';
import CODE from '../../../constants/code';
import URL from '../../../constants/url';

const AdminMatchDetail = props => {
  const navigate = useNavigate();

  const STATUS_LABEL = {
    SCHEDULED: '경기 예정',
    LIVE: '진행중',
    FINISHED: '경기 종료',
    POSTPONED: '경기 연기',
    CANCELLED: '경기 취소',
  };

  const [matchInfo, setMatchInfo] = useState({
    uniformList: [
      { teamId: '', topColor: '', bottomColor: '', socksColor: '' }, // HOME
      { teamId: '', topColor: '', bottomColor: '', socksColor: '' }, // AWAY
    ],
  });

  // 삭제 버튼 클릭 핸들러
  const handleOnDelete = async matchId => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const deleteUrl = `/api/deleteMatch.do?matchId=${matchId}`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    };

    try {
      const resp = await ApiFetch.requestFetch(deleteUrl, requestOptions);

      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        navigate({ pathname: URL.ADMIN_MATCH });
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류 발생');
    }
  };

  // 경기 정보 조회
  const fetchMatchInfo = async () => {
    try {
      const resp = await ApiFetch.requestFetch(
        `/api/retrieveMatchDetail.do?matchId=${props.matchId}`,
        {
          method: 'GET',
        },
      );
      console.log('경기 정보 조회 결과:', resp.result);
      if (resp && resp.result) {
        const match = resp.result.match;

        setMatchInfo({
          ...match,
          statusNm: STATUS_LABEL[match.status] || '-',
          uniformList: resp.result.matchUniform,
        });
      }
    } catch (error) {
      console.error('경기 정보 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchMatchInfo();
  }, [props.matchId]);

  return (
    <main className="bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold mb-6">경기 상세</h3>
        {/* 경기 정보 */}
        <div className="flex flex-col gap-4 bg-white p-6 mt-4 rounded-lg shadow">
          <div className="flex items-center">
            <span className="font-bold w-32">리그/대회</span>
            <span className="text-gray-600">{matchInfo.leagueNm}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold w-32">경기일시</span>
            <span className="text-gray-600">
              {matchInfo.matchDate} {matchInfo.kickoffTime?.slice(0, 5)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-bold w-32">경기장</span>
            <span className="text-gray-600">{matchInfo.venueNm}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold w-32">상태</span>
            <span className="text-gray-600">{matchInfo.statusNm}</span>
          </div>
        </div>
        {/* 매치업 정보 */}
        <div className="bg-white p-8 mt-4 rounded-lg shadow">
          <div className="flex items-center justify-center">
            <div className="flex-1 text-center">
              <div className="text-sm text-gray-500 mb-2">HOME</div>

              <div className="text-3xl font-bold">{matchInfo.homeTeamNm}</div>
            </div>

            <div className="px-10 text-4xl font-bold text-gray-400">VS</div>

            <div className="flex-1 text-center">
              <div className="text-sm text-gray-500 mb-2">AWAY</div>

              <div className="text-3xl font-bold">{matchInfo.awayTeamNm}</div>
            </div>
          </div>
        </div>
        {/* 라인업 등록 및 실시간 시작, 수정/취소/연기/삭제 버튼 */}
        <div className="bg-white p-6 mt-4 rounded-lg shadow">
          <h4 className="text-lg font-bold text-gray-700 mb-4">경기 관리</h4>
          {matchInfo.status === 'SCHEDULED' && (
            <>
              <div className="flex gap-3 mb-6">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
                  라인업 등록
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
                  실시간 시작
                </button>
              </div>
              <div className="flex justify-end gap-3">
                <Link
                  to={`/admin/match/${matchInfo.matchId}/modify`}
                  className="px-5 py-2.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  수정
                </Link>
                <button className="px-5 py-2.5 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition">
                  연기
                </button>
                <button className="px-5 py-2.5 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition">
                  취소
                </button>
                <button
                  className="px-5 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  onClick={() => handleOnDelete(matchInfo.matchId)}
                >
                  삭제
                </button>
              </div>
            </>
          )}
          {matchInfo.status === 'LIVE' && (
            <>
              <div className="flex gap-3 mb-6">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
                  라인업 보기
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
                  실시간 입력
                </button>
              </div>
            </>
          )}
          {matchInfo.status === 'FINISHED' && (
            <>
              <div className="flex gap-3 mb-6">
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
                  결과 보기
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
                  라인업 보기
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
                  타임라인 보기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminMatchDetail;
