import { useEffect, useState } from 'react';
import CODE from '../../../constants/code';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import URL from '../../../constants/url';
import * as ApiFetch from '../../../api/apiFetch';

const FORMATIONS = {
  '4-4-2': [
    { key: 'GK', top: '88%', left: '50%' },

    { key: 'LB', top: '72%', left: '15%' },
    { key: 'CB1', top: '72%', left: '38%' },
    { key: 'CB2', top: '72%', left: '62%' },
    { key: 'RB', top: '72%', left: '85%' },

    { key: 'LM', top: '50%', left: '15%' },
    { key: 'CM1', top: '50%', left: '38%' },
    { key: 'CM2', top: '50%', left: '62%' },
    { key: 'RM', top: '50%', left: '85%' },

    { key: 'ST1', top: '20%', left: '38%' },
    { key: 'ST2', top: '20%', left: '62%' },
  ],

  '4-3-3': [
    { key: 'GK', top: '88%', left: '50%' },

    { key: 'LB', top: '72%', left: '15%' },
    { key: 'CB1', top: '72%', left: '38%' },
    { key: 'CB2', top: '72%', left: '62%' },
    { key: 'RB', top: '72%', left: '85%' },

    { key: 'CM1', top: '50%', left: '25%' },
    { key: 'CM2', top: '50%', left: '50%' },
    { key: 'CM3', top: '50%', left: '75%' },

    { key: 'LW', top: '20%', left: '20%' },
    { key: 'ST', top: '15%', left: '50%' },
    { key: 'RW', top: '20%', left: '80%' },
  ],

  '4-2-3-1': [
    { key: 'GK', top: '88%', left: '50%' },

    { key: 'LB', top: '72%', left: '15%' },
    { key: 'CB1', top: '72%', left: '38%' },
    { key: 'CB2', top: '72%', left: '62%' },
    { key: 'RB', top: '72%', left: '85%' },

    { key: 'CDM1', top: '55%', left: '38%' },
    { key: 'CDM2', top: '55%', left: '62%' },

    { key: 'LAM', top: '35%', left: '15%' },
    { key: 'CAM', top: '35%', left: '50%' },
    { key: 'RAM', top: '35%', left: '85%' },

    { key: 'ST', top: '15%', left: '50%' },
  ],

  '3-5-2': [
    { key: 'GK', top: '88%', left: '50%' },

    { key: 'CB1', top: '72%', left: '25%' },
    { key: 'CB2', top: '72%', left: '50%' },
    { key: 'CB3', top: '72%', left: '75%' },

    { key: 'LWB', top: '50%', left: '10%' },
    { key: 'CM1', top: '50%', left: '35%' },
    { key: 'CM2', top: '50%', left: '50%' },
    { key: 'CM3', top: '50%', left: '65%' },
    { key: 'RWB', top: '50%', left: '90%' },

    { key: 'ST1', top: '20%', left: '38%' },
    { key: 'ST2', top: '20%', left: '62%' },
  ],
};

const AdminMatchLineup = ({
  matchId,
  readOnly = false,
  embedded = false,
}) => {
  const navigate = useNavigate();

  const [matchInfo, setMatchInfo] = useState({});
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  const [homeFormation, setHomeFormation] = useState('4-2-3-1');
  const [awayFormation, setAwayFormation] = useState('4-2-3-1');

  const [homeLineup, setHomeLineup] = useState({});
  const [awayLineup, setAwayLineup] = useState({});

  const [homeSubs, setHomeSubs] = useState([]);
  const [awaySubs, setAwaySubs] = useState([]);

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    navigate({ pathname: URL.getAdminMatchDetail(matchId) });
  };

  const toggleSubstitute = (playerId, substituteList, setSubstituteList) => {
    setSubstituteList(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId],
    );
  };

  const renderField = (
    title,
    playerList,
    formation,
    setFormation,
    lineup,
    setLineup,
    subs,
    setSubs,
  ) => {
    const selectedStarterIds = Object.values(lineup);
    const availablePlayers = player =>
      !selectedStarterIds.includes(player.playerId);
    const availableSubs = player =>
      !selectedStarterIds.includes(player.playerId);

    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>

        {/* 포메이션 */}
        <div className="mb-6">
          <label className="font-semibold">포메이션</label>

          <select
            className="ml-4 border rounded px-3 py-2"
            disabled={readOnly}
            value={formation}
            onChange={e => {
              setFormation(e.target.value);

              // 포메이션 바뀌면 기존 선발 초기화
              setLineup({});
            }}
          >
            {Object.keys(FORMATIONS).map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* 축구장 */}
        <div className="relative h-[700px] bg-green-600 rounded-xl overflow-hidden">
          <div className="absolute inset-4 border-2 border-white" />

          <div className="absolute left-1/2 top-4 bottom-4 w-[2px] bg-white" />

          <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />

          {FORMATIONS[formation].map(pos => (
            <div
              key={pos.key}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                top: pos.top,
                left: pos.left,
              }}
            >
              <select
                className="w-36 bg-white border rounded px-2 py-1 text-xs shadow"
                disabled={readOnly}
                value={lineup[pos.key] || ''}
                onChange={e => {
                  const playerId = Number(e.target.value);
                  setLineup(prev => ({
                    ...prev,
                    [pos.key]: playerId,
                  }));
                  setSubs(prev => prev.filter(id => id !== playerId));
                }}
              >
                <option value="">{pos.key}</option>

                {playerList.map(player => {
                  const alreadySelected =
                    selectedStarterIds.includes(player.playerId) &&
                    lineup[pos.key] !== player.playerId;

                  return (
                    <option
                      key={player.playerId}
                      value={player.playerId}
                      disabled={alreadySelected}
                    >
                      {player.uniformNum}번 {player.name}
                      {alreadySelected ? ' (선택됨)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
        <div className="mb-4 flex justify-between">
          <span>선발 :{Object.keys(lineup).length}명</span>

          <span>교체 :{subs.length}명</span>
        </div>
        {/* 교체 선수 */}
        <div className="mt-6">
          <h4 className="font-bold text-lg mb-3">교체 선수</h4>

          <div className="grid grid-cols-2 gap-2">
            {playerList.map(player => (
              <label key={player.playerId} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={readOnly || selectedStarterIds.includes(player.playerId)}
                  checked={subs.includes(player.playerId)}
                  onChange={() =>
                    toggleSubstitute(player.playerId, subs, setSubs)
                  }
                />

                <span>
                  {player.uniformNum}번 {player.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleSave = async () => {

    // HOME 선발 11명 체크
    if (Object.keys(homeLineup).length !== 11) {
      alert('HOME 선발 선수는 11명을 선택해야 합니다.');
      return;
    }

    // AWAY 선발 11명 체크
    if (Object.keys(awayLineup).length !== 11) {
      alert('AWAY 선발 선수는 11명을 선택해야 합니다.');
      return;
    }

    // HOME 교체선수 최소 1명
    if (homeSubs.length === 0) {
      alert('HOME 교체 선수를 1명 이상 선택해주세요.');
      return;
    }

    // AWAY 교체선수 최소 1명
    if (awaySubs.length === 0) {
      alert('AWAY 교체 선수를 1명 이상 선택해주세요.');
      return;
    }

    // HOME 중복 체크
    const homeStarterIds = Object.values(homeLineup);

    const homeDuplicate =
      homeStarterIds.some(playerId => homeSubs.includes(playerId));

    if (homeDuplicate) {
      alert('HOME 선발 선수와 교체 선수에 중복된 선수가 있습니다.');
      return;
    }

    // AWAY 중복 체크
    const awayStarterIds = Object.values(awayLineup);

    const awayDuplicate =
      awayStarterIds.some(playerId => awaySubs.includes(playerId));

    if (awayDuplicate) {
      alert('AWAY 선발 선수와 교체 선수에 중복된 선수가 있습니다.');
      return;
    }

    const homePlayers = [];
    const awayPlayers = [];

    Object.entries(homeLineup).forEach(([position, playerId]) => {
      homePlayers.push({
        playerId,
        position,
        isStarting: 1,
      });
    });

    homeSubs.forEach(playerId => {
      homePlayers.push({
        playerId,
        position: null,
        isStarting: 0,
      });
    });

    Object.entries(awayLineup).forEach(([position, playerId]) => {
      awayPlayers.push({
        playerId,
        position,
        isStarting: 1,
      });
    });

    awaySubs.forEach(playerId => {
      awayPlayers.push({
        playerId,
        position: null,
        isStarting: 0,
      });
    });

    const requestData = {
      matchId: matchId,

      homeFormation,
      awayFormation,

      homePlayers,
      awayPlayers,
    };

    console.log(requestData);

    try {
      const resp = await ApiFetch.requestFetch('/api/registerMatchLineup.do', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        navigate({ pathname: URL.ADMIN_MATCH });
      } else {
        alert('라인업 저장 실패');
      }

    } catch (e) {
      console.error('라인업 저장 실패:', e);
      alert('라인업 저장 실패');
    }
  };

  // 라인업 조회
  const fetchLineupInfo = async () => {
    try {
      console.log('라인업 정보 조회 matchId:', matchId);
      const resp = await ApiFetch.requestFetch(
        `/api/retrieveMatchLineupInfo.do?matchId=${matchId}`,
        {
          method: 'GET',
        },
      );
      console.log('라인업 정보 조회 결과:', resp.result);
      if (resp && resp.result) {

        setMatchInfo(resp.result.match);

        setHomePlayers(resp.result.homePlayers || []);
        setAwayPlayers(resp.result.awayPlayers || []);

        // 포메이션
        setHomeFormation(resp.result.homeFormation || '4-2-3-1');
        setAwayFormation(resp.result.awayFormation || '4-2-3-1');

        // 선발
        setHomeLineup(resp.result.homeLineup || {});
        setAwayLineup(resp.result.awayLineup || {});

        // 교체
        setHomeSubs(resp.result.homeSubs || []);
        setAwaySubs(resp.result.awaySubs || []);
      }
    } catch (error) {
      console.error('라인업 정보 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchLineupInfo();
  }, [matchId]);

  return (
    <main className={embedded ? '' : 'bg-gray-200 min-h-screen'}>
      <div className={embedded ? '' : 'max-w-[1800px] mx-auto px-10 py-8'}>
        {!embedded && (
          <h2 className="text-3xl font-bold mb-8">
            {readOnly ? '경기 라인업 조회' : '경기 라인업 등록'}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-8">
          {renderField(
            `HOME - ${matchInfo.homeTeamNm || ''}`,
            homePlayers,
            homeFormation,
            setHomeFormation,
            homeLineup,
            setHomeLineup,
            homeSubs,
            setHomeSubs,
          )}

          {renderField(
            `AWAY - ${matchInfo.awayTeamNm || ''}`,
            awayPlayers,
            awayFormation,
            setAwayFormation,
            awayLineup,
            setAwayLineup,
            awaySubs,
            setAwaySubs,
          )}
        </div>

        {/* 버튼 */}
        {!embedded && (
          <div className="flex justify-end mt-6 gap-4">
            <Button
              className="bg-gray-100 text-black px-8 py-2 rounded"
              onClick={handleOnCancel}
            >
              취소
            </Button>
            {!readOnly && (
              <Button
                className="bg-black text-white px-10 py-3 rounded-lg"
                onClick={handleSave}
              >
                저장
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminMatchLineup;
