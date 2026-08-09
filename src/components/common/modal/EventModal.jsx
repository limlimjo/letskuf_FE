import { useEffect, useState } from 'react';

const TITLE_MAP = {
  GOAL: '⚽ 골 등록',
  YELLOW_CARD: '🟨 경고 등록',
  RED_CARD: '🟥 퇴장 등록',
};

const EventModal = ({
  type,
  open,
  onClose,
  onSave,

  homeTeam,
  awayTeam,

  homeTeamId,
  awayTeamId,

  homePlayers = [],
  awayPlayers = [],
}) => {
  const [minute, setMinute] = useState('');
  const [teamId, setTeamId] = useState('');
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    if (open) {
      setMinute('');
      setTeamId('');
      setPlayerId('');
    }
  }, [open]);

  if (!open) return null;

  const players =
    Number(teamId) === Number(homeTeamId)
      ? homePlayers
      : Number(teamId) === Number(awayTeamId)
        ? awayPlayers
        : [];

  const handleSave = () => {
    if (!minute) {
      alert('시간을 입력해주세요.');
      return;
    }

    if (!teamId) {
      alert('팀을 선택해주세요.');
      return;
    }

    if (!playerId) {
      alert('선수를 선택해주세요.');
      return;
    }

    onSave({
      eventType: type,
      minute,
      teamId: Number(teamId),
      playerId: Number(playerId),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg w-[500px] p-6">

        <h3 className="font-bold text-xl mb-5">
          {TITLE_MAP[type]}
        </h3>

        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="45+1"
          value={minute}
          onChange={e => setMinute(e.target.value)}
        />

        <select
          className="w-full border rounded p-2 mb-3"
          value={teamId}
          onChange={e => {
            setTeamId(e.target.value);
            setPlayerId('');
          }}
        >
          <option value="">팀 선택</option>

          <option value={homeTeamId}>
            HOME - {homeTeam}
          </option>

          <option value={awayTeamId}>
            AWAY - {awayTeam}
          </option>
        </select>

        <select
          className="w-full border rounded p-2"
          value={playerId}
          onChange={e => setPlayerId(e.target.value)}
        >
          <option value="">선수 선택</option>

          {players.map(player => (
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

export default EventModal;