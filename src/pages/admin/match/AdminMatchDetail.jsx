import { useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import { Link, useNavigate } from 'react-router-dom';
import CODE from '../../../constants/code';
import URL from '../../../constants/url';
import AdminMatchLineup from './AdminMatchLineup';

const AdminMatchDetail = props => {
  const navigate = useNavigate();

  const STATUS_LABEL = {
    SCHEDULED: '경기 예정',
    FIRST_HALF: '전반 진행중',
    HALF_TIME: '하프타임',
    SECOND_HALF: '후반 진행중',
    FINISHED: '경기 종료',
    POSTPONED: '경기 연기',
    CANCELLED: '경기 취소',
  };

  const EVENT_LABEL = {
    GOAL: '⚽ 골',
    YELLOW_CARD: '🟨 경고',
    RED_CARD: '🟥 퇴장',
    SUBSTITUTION: '🔄 교체',
    MATCH_START: '🏁 경기 시작',
    FIRST_HALF_END: '⏸ 전반 종료',
    SECOND_HALF_START: '▶ 후반 시작',
    MATCH_END: '🏆 경기 종료',
  };

  // minute 포맷
  const formatMinute = item => {
    if (!item.extraMinute || item.extraMinute === 0) {
      return `${item.minute}'`;
    }

    return `${item.minute}+${item.extraMinute}'`;
  };

  // 경기 상태
  const isMatchStatusEvent = eventType => {
    return [
      'MATCH_START',
      'FIRST_HALF_END',
      'SECOND_HALF_START',
      'MATCH_END',
    ].includes(eventType);
  };

  const [matchInfo, setMatchInfo] = useState({
    uniformList: [
      { teamId: '', topColor: '', bottomColor: '', socksColor: '' }, // HOME
      { teamId: '', topColor: '', bottomColor: '', socksColor: '' }, // AWAY
    ],
  });

  const [lineupCompleted, setLineupCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('lineup');
  const [timeline, setTimeline] = useState([]);

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
      
      if (resp && resp.result) {
        const match = resp.result.match;

        setMatchInfo({
          ...match,
          statusNm: STATUS_LABEL[match.status] || '-',
          uniformList: resp.result.matchUniform,
        });

        console.log('경기정보 조회 결과:', resp.result.match);

        setLineupCompleted(
          resp.result.lineupCompleted || false
        );

        setTimeline(resp.result.timeline || []);

        console.log('타임라인 조회 결과:', resp.result.timeline);
      }
    } catch (error) {
      console.error('경기 정보 조회 실패:', error);
    }
  };

  const handleChangeStatus = async (status, message) => {

    if (!window.confirm(message)) {
      return;
    }

    try {
      await ApiFetch.requestFetch(
        '/api/changeMatchStatus.do',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            matchId: props.matchId,
            status,
          }),
        },
      );
      alert('상태가 변경되었습니다.');
      fetchMatchInfo();
    } catch (e) {
      console.error(e);
    }
  };

  const isLiveMatch = ['FIRST_HALF', 'HALF_TIME', 'SECOND_HALF'].includes(matchInfo.status);
  const isPostponed = matchInfo.status === 'POSTPONED';
  const isCancelled = matchInfo.status === 'CANCELLED';

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
            <div className="px-10 text-center">
              {matchInfo.status === 'FINISHED' ? (
                <>
                  <div className="text-5xl font-bold text-blue-600">
                    {matchInfo.homeScore} : {matchInfo.awayScore}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    경기 종료
                  </div>
                </>
              ) : (
                <div className="text-4xl font-bold text-gray-400">
                  VS
                </div>
              )}
            </div>
            <div className="flex-1 text-center">
              <div className="text-sm text-gray-500 mb-2">AWAY</div>
              <div className="text-3xl font-bold">{matchInfo.awayTeamNm}</div>
            </div>
          </div>
        </div>
        {/* 라인업 등록 및 실시간 시작, 수정/취소/연기/삭제 버튼 */}
        <div className="bg-white p-6 mt-4 rounded-lg shadow">
          {matchInfo.status === 'SCHEDULED' && (
            <>
              <div className="flex gap-3 mb-6">
                <Link
                  to={`/admin/match/${matchInfo.matchId}/lineup`}
                  className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-sm"
                >
                  라인업 관리
                </Link>
                <Link
                  to={
                    lineupCompleted
                      ? `/admin/match/${matchInfo.matchId}/live`
                      : '#'
                  }
                  onClick={e => {
                    if (!lineupCompleted) {
                      e.preventDefault();
                      alert(
                        '라인업 등록을 완료해야 실시간 입력을 시작할 수 있습니다.'
                      );
                    }
                  }}
                  className={`flex-1 flex items-center justify-center py-3 rounded-lg text-white font-semibold
                    ${
                      lineupCompleted
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  실시간 시작
                </Link>
              </div>
              <div className="flex justify-end gap-3">
                <Link
                  to={`/admin/match/${matchInfo.matchId}/modify`}
                  className="px-5 py-2.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  수정
                </Link>
                <button
                  className="px-5 py-2.5 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                  onClick={() =>
                    handleChangeStatus(
                      'POSTPONED',
                      '경기를 연기하시겠습니까?',
                    )
                  }
                >
                  연기
                </button>
                <button
                  className="px-5 py-2.5 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                  onClick={() =>
                    handleChangeStatus(
                      'CANCELLED',
                      '경기를 취소하시겠습니까?',
                    )
                  }
                >
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
          {isLiveMatch && (
            <>
              <div className="flex gap-3 mb-6">
                <Link 
                  to={`/admin/match/${matchInfo.matchId}/lineup/view`}
                  className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-sm"
                >
                  라인업 보기
                </Link>
                <Link
                  to={`/admin/match/${matchInfo.matchId}/live`} 
                  className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
                  실시간 입력
                </Link>
              </div>
            </>
          )}
          {matchInfo.status === 'FINISHED' && (
            <div className="bg-white p-6 mt-4 rounded-lg shadow">
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('lineup')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    activeTab === 'lineup'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  라인업
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    activeTab === 'timeline'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  경기 타임라인
                </button>
              </div>
              {/* 라인업 탭 */}
              {activeTab === 'lineup' && (
                <AdminMatchLineup 
                    matchId={matchInfo.matchId} 
                    readOnly={true}
                    embedded={true}
                />
              )}
              {/* 경기 타임라인 탭 */}
              {activeTab === 'timeline' && (
                <div className="space-y-3">
                    {timeline.map(item => (
                        <div
                          key={item.eventId}
                          className="border rounded-lg p-4 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-bold text-lg">
                              {formatMinute(item)}
                            </div>

                            {isMatchStatusEvent(item.eventType) ? (
                              <div className="font-semibold text-blue-600">
                                {EVENT_LABEL[item.eventType]}
                              </div>
                            ) : (
                              <>
                                <div>
                                  [{item.teamNm}]
                                  {' '}
                                  {item.playerNm}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {EVENT_LABEL[item.eventType]}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
          )}
          {isPostponed && (
            <>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">
                  ⏸️
                </div>
                <div className="font-bold text-yellow-700">
                  연기된 경기입니다.
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  경기 일정 변경 후 다시 진행할 수 있습니다.
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Link
                  to={`/admin/match/${matchInfo.matchId}/modify`}
                  className="px-5 py-2.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  경기 일정 수정
                </Link>
                <button
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() =>
                    handleChangeStatus(
                      'SCHEDULED',
                      '경기를 예정 상태로 복구하시겠습니까?'
                    )
                  }
                >
                  예정 상태 복구
                </button>
              </div>
            </>
          )}
          {isCancelled && (
            <>
              <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">
                  ❌
                </div>
                <div className="font-bold text-red-700">
                  취소된 경기입니다.
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  경기 진행이 취소되었습니다.
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() =>
                    handleChangeStatus(
                      'SCHEDULED',
                      '경기를 예정 상태로 복구하시겠습니까?'
                    )
                  }
                >
                  예정 상태 복구
                </button>
                <button
                  className="px-5 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  onClick={() => handleOnDelete(matchInfo.matchId)}
                >
                  삭제
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
