import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import EventModal from '../../../components/common/modal/EventModal'
import SubstitutionModal from '../../../components/match/modal/SubstitutionModal';
import * as ApiFetch from '../../../api/apiFetch';
import MatchStatusModal from '../../../components/match/modal/MatchStatusModal';

const STATUS_LABEL = {
  SCHEDULED: '경기 예정',
  FIRST_HALF: '전반전',
  HALF_TIME: '하프타임',
  SECOND_HALF: '후반전',
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

const AdminMatchLiveEdit = props => {
  const navigate = useNavigate();

  const [matchInfo, setMatchInfo] = useState({});
  const [timeline, setTimeline] = useState([]);

  const [eventType, setEventType] = useState(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [statusModal, setStatusModal] = useState({
    open: false,
    status: null,
    minute: 0,
    extraMinute: 0,
  });

  // 상태 변경 모달 열기 함수
  const openStatusModal = (status) => {

    let minute = 0;
    let extraMinute = 0;

    switch(status) {
      case 'FIRST_HALF':
        minute = 0;
        break;

      case 'HALF_TIME':
        minute = 45;
        break;

      case 'SECOND_HALF':
        minute = 46;
        break;

      case 'FINISHED':
        minute = 90;
        break;

      default:
        break;
    }

    setStatusModal({
      open: true,
      status,
      minute,
      extraMinute,
    });
  };

  const canRegisterEvent = matchInfo.status === 'FIRST_HALF' ||
                          matchInfo.status === 'SECOND_HALF';
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

  const fetchMatchInfo = async () => {
    try {
      const resp = await ApiFetch.requestFetch(
        `/api/retrieveMatchLiveInfo.do?matchId=${props.matchId}`,
        { method: 'GET' },
      );

      if (resp?.result) {
        setMatchInfo({
          ...resp.result.match,

          homeLineupPlayers:
            resp.result.homeLineupPlayers || [],

          awayLineupPlayers:
            resp.result.awayLineupPlayers || [],

          homeBenchPlayers:
            resp.result.homeSubPlayers || [],

          awayBenchPlayers:
            resp.result.awaySubPlayers || [],
        });
        console.log('matchInfo 출력', resp.result.match);
        console.log('matchInfo matchId 출력', resp.result.match.matchId);
        console.log('matchInfo status 출력', resp.result.match.status);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTimeline = async () => {
    console.log("fetchTimeline 호출")
    try {
      const resp = await ApiFetch.requestFetch(
        `/api/retrieveMatchTimeline.do?matchId=${props.matchId}`,
        { method: 'GET' },
      );
      console.log("timeline 출력: ", timeline);
      setTimeline(resp?.result?.resultList || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveEvent = async data => {
    try {
      await ApiFetch.requestFetch(
        '/api/registerMatchEvent.do',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            matchId: props.matchId,
            ...data,
          }),
        },
      );

      setEventType(null);
      setShowSubModal(false);

      fetchTimeline();
      fetchMatchInfo();

    } catch (e) {
      console.error(e);
      alert('이벤트 등록 실패');
    }
  };

const handleChangeStatus = async (
    status,
    minute,
    extraMinute
  ) => {

    let message = '';

    switch(status) {

      case 'FIRST_HALF':
        message = '경기를 시작하시겠습니까?';
        break;

      case 'HALF_TIME':
        message = '전반을 종료하시겠습니까?';
        break;

      case 'SECOND_HALF':
        message = '후반을 시작하시겠습니까?';
        break;

      case 'FINISHED':
        message = '경기를 종료하시겠습니까?';
        break;

      default:
        message = '상태를 변경하시겠습니까?';
    }


    if (!window.confirm(message)) {
      return;
    }

    try {
      await ApiFetch.requestFetch(
        '/api/changeMatchStatus.do',
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify({
            matchId: props.matchId,
            status,
            minute,
            extraMinute,
          }),
        }
      );


      setStatusModal({
        open:false,
        status:null,
        minute:0,
        extraMinute:0,
      });


      fetchMatchInfo();
      fetchTimeline();


    } catch(e){
      console.error(e);
      alert('상태 변경 실패');
    }
  };

  const handleDeleteEvent = async eventId => {
    if (!window.confirm('이 이벤트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await ApiFetch.requestFetch(
        `/api/deleteMatchEvent.do?eventId=${eventId}`,
        {
          method: 'POST',
        },
      );

      fetchTimeline();
      fetchMatchInfo();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {

    console.log("useEffect 호출33");

    const init = async () => {

      try {
        await fetchMatchInfo();
        await fetchTimeline();
      } catch(e) {
        console.error("init error", e);
      }
    };
    init();
  }, [props.matchId]);

  return (
    <main className="bg-gray-200 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-8 py-8">

        {/* 경기 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-3xl font-bold mb-4">
            실시간 경기 관리
          </h2>

          <div className="text-center text-3xl font-bold">
            {matchInfo.homeTeamNm}

            <span className="mx-6 text-blue-600">
              {matchInfo.homeScore || 0}
              {' : '}
              {matchInfo.awayScore || 0}
            </span>

            {matchInfo.awayTeamNm}
          </div>

          <div className="text-center mt-3 text-gray-500">
            {STATUS_LABEL[matchInfo.status]}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* 이벤트 등록 */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-bold text-xl mb-5">
              이벤트 등록
            </h3>

            <div className="space-y-3">
              <Button
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={!canRegisterEvent}
                onClick={() => setEventType('GOAL')}
              >
                ⚽ 골 등록
              </Button>

              <Button
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={!canRegisterEvent}
                onClick={() => setShowSubModal(true)}
              >
                🔄 교체 등록
              </Button>

              <Button
                className="w-full bg-amber-500 text-white hover:bg-amber-600"
                disabled={!canRegisterEvent}
                onClick={() => setEventType('YELLOW_CARD')}
              >
                🟨 경고 등록
              </Button>

              <Button
                className="w-full bg-rose-600 text-white hover:bg-rose-700"
                disabled={!canRegisterEvent}
                onClick={() => setEventType('RED_CARD')}
              >
                🟥 퇴장 등록
              </Button>
            </div>

            <hr className="my-6" />

            {matchInfo.status === 'SCHEDULED' && (
              <Button
                className="
                  w-full
                  rounded-lg
                  bg-green-700
                  px-4
                  py-3
                  text-white
                  font-semibold
                  shadow-sm
                  hover:bg-green-800
                  transition
                "
                onClick={() => openStatusModal('FIRST_HALF')}
              >
                🏁 경기 시작
              </Button>
            )}

            {matchInfo.status === 'FIRST_HALF' && (
              <div className="flex flex-col gap-3">
                <Button
                  className="
                    w-full
                    rounded-lg
                    bg-orange-500
                    px-4
                    py-3
                    text-white
                    font-semibold
                    shadow-sm
                    hover:bg-orange-600
                    transition
                  "
                  onClick={() => openStatusModal('HALF_TIME')}
                >
                  ⏸ 전반 종료
                </Button>

                <Button
                  className="
                    w-full
                    rounded-lg
                    bg-gray-700
                    px-4
                    py-3
                    text-white
                    font-semibold
                    shadow-sm
                    hover:bg-gray-800
                    transition
                  "
                  onClick={() => openStatusModal('FINISHED')}
                >
                  🏆 경기 종료
                </Button>
              </div>
            )}

            {matchInfo.status === 'HALF_TIME' && (
              <Button
                className="
                  w-full
                  rounded-lg
                  bg-sky-600
                  px-4
                  py-3
                  text-white
                  font-semibold
                  shadow-sm
                  hover:bg-sky-700
                  transition
                "
                onClick={() => openStatusModal('SECOND_HALF')}
              >
                ▶ 후반 시작
              </Button>
            )}

            {matchInfo.status === 'SECOND_HALF' && (
              <Button
                className="
                  w-full
                  rounded-lg
                  bg-red-600
                  px-4
                  py-3
                  text-white
                  font-semibold
                  shadow-sm
                  hover:bg-red-700
                  transition
                "
                onClick={() => openStatusModal('FINISHED')}
              >
                🏆 경기 종료
              </Button>
            )}
          </div>

          {/* 타임라인 */}
          <div className="col-span-2 bg-white rounded-lg shadow p-6">

            <h3 className="font-bold text-xl mb-5">
              경기 타임라인
            </h3>

            <div className="space-y-3">
              {timeline.length === 0 && (
                <div className="text-gray-400">
                  등록된 이벤트가 없습니다.
                </div>
              )}

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
                  <button
                    className="text-red-500 text-sm"
                    onClick={() =>
                      handleDeleteEvent(item.eventId)
                    }
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MatchStatusModal
        open={statusModal.open}
        status={statusModal.status}
        minute={statusModal.minute}
        onClose={() =>
          setStatusModal({
            open:false,
            status:null,
            minute:0,
            extraMinute:0,
          })
        }
        onSave={handleChangeStatus}
      />
      <EventModal
        type={eventType}
        open={!!eventType}
        onClose={() => setEventType(null)}
        onSave={handleSaveEvent}
        homeTeam={matchInfo.homeTeamNm}
        awayTeam={matchInfo.awayTeamNm}
        homeTeamId={matchInfo.homeTeamId}
        awayTeamId={matchInfo.awayTeamId}
        homePlayers={
          matchInfo.homeLineupPlayers || []
        }
        awayPlayers={
          matchInfo.awayLineupPlayers || []
        }
      />
      <SubstitutionModal
        open={showSubModal}
        onClose={() => setShowSubModal(false)}
        onSave={handleSaveEvent}

        homeTeam={matchInfo.homeTeamNm}
        awayTeam={matchInfo.awayTeamNm}

        homeTeamId={matchInfo.homeTeamId}
        awayTeamId={matchInfo.awayTeamId}

        homeLineupPlayers={
          matchInfo.homeLineupPlayers || []
        }

        awayLineupPlayers={
          matchInfo.awayLineupPlayers || []
        }

        homeBenchPlayers={
          matchInfo.homeBenchPlayers || []
        }

        awayBenchPlayers={
          matchInfo.awayBenchPlayers || []
        }
      />
    </main>
  );
};

export default AdminMatchLiveEdit;