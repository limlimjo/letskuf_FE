import { useEffect, useState } from 'react';

const SubstitutionModal = ({
  open,
  onClose,
  onSave,

  homeTeam,
  awayTeam,

  homeTeamId,
  awayTeamId,

  homeLineupPlayers,
  awayLineupPlayers,

  homeBenchPlayers,
  awayBenchPlayers,
}) => {
  const [minute, setMinute] = useState('');
  const [teamId, setTeamId] = useState('');
  const [outPlayerId, setOutPlayerId] = useState('');
  const [inPlayerId, setInPlayerId] = useState('');

  useEffect(() => {
    if (open) {
      setMinute('');
      setTeamId('');
      setOutPlayerId('');
      setInPlayerId('');
    }
  }, [open]);

  if (!open) return null;

  const lineupPlayers =
    Number(teamId) === Number(homeTeamId)
      ? homeLineupPlayers
      : awayLineupPlayers;

  const benchPlayers =
    Number(teamId) === Number(homeTeamId)
      ? homeBenchPlayers
      : awayBenchPlayers;

  const handleSave = () => {
    if (!minute) {
      alert('시간을 입력해주세요.');
      return;
    }

    if (!teamId) {
      alert('팀을 선택해주세요.');
      return;
    }

    if (!outPlayerId) {
      alert('교체 OUT 선수를 선택해주세요.');
      return;
    }

    if (!inPlayerId) {
      alert('교체 IN 선수를 선택해주세요.');
      return;
    }

    onSave({
      eventType: 'SUBSTITUTION',
      minute,
      teamId: Number(teamId),
      playerId: Number(outPlayerId),
      relatedPlayerId: Number(inPlayerId),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg w-[600px] p-6">

        <h3 className="font-bold text-xl mb-5">
          🔄 교체 등록
        </h3>

        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="65"
          value={minute}
          onChange={e => setMinute(e.target.value)}
        />

        <select
          className="w-full border rounded p-2 mb-3"
          value={teamId}
          onChange={e => {
            setTeamId(e.target.value);
            setOutPlayerId('');
            setInPlayerId('');
          }}
        >
          <option value="">
            팀 선택
          </option>

          <option value={homeTeamId}>
            HOME - {homeTeam}
          </option>

          <option value={awayTeamId}>
            AWAY - {awayTeam}
          </option>
        </select>

        <label className="font-semibold">
          교체 OUT
        </label>

        <select
          className="w-full border rounded p-2 mb-3"
          value={outPlayerId}
          onChange={e =>
            setOutPlayerId(e.target.value)
          }
        >
          <option value="">
            출전중 선수 선택
          </option>

          {lineupPlayers?.map(player => (
            <option
              key={player.playerId}
              value={player.playerId}
            >
              {player.uniformNum}번 {player.playerNm}
            </option>
          ))}
        </select>

        <label className="font-semibold">
          교체 IN
        </label>

        <select
          className="w-full border rounded p-2"
          value={inPlayerId}
          onChange={e =>
            setInPlayerId(e.target.value)
          }
        >
          <option value="">
            벤치 선수 선택
          </option>

          {benchPlayers?.map(player => (
            <option
              key={player.playerId}
              value={player.playerId}
            >
              {player.uniformNum}번 {player.playerNm}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 mt-5">

          <button
            className="border px-4 py-2 rounded"
            onClick={onClose}
          >
            취소
          </button>

          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            저장
          </button>

        </div>

      </div>

    </div>
  );
};

export default SubstitutionModal;