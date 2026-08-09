import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import { Link, useLocation } from 'react-router-dom';
import Pagination from '../../../components/common/Pagination';

const AdminMatchResult = () => {
  const location = useLocation();

  // 검색 조건
  const [searchCondition, setSearchCondition] = useState({
        pageIndex: 1,
        type: '',
        leagueId: '',
        keyword: '',
        status: '',
        startDate: '',
        endDate: '',
  });

  // 리그/대회 구분
  const [leagueType, setLeagueType] = useState('');
  // 리그/대회 목록
  const [leagueList, setLeagueList] = useState([]);

  const [matchList, setMatchList] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});

  const retrieveLeagueList = async type => {
    if (!type) {
        setLeagueList([]);
        return;
    }

    try {
        const params = { type };
        console.log('리그/대회 목록 조회 요청:', params);
        const resp = await ApiFetch.requestFetch(
          '/api/retrieveLeagueList.do' + ApiFetch.getQueryString(params),
          { method: 'GET' },
        );
        console.log('리그/대회 목록 조회 응답:', resp.result.resultList);
        setLeagueList(resp.result.resultList || []);
    } catch (error) {
        console.error('리그/대회 목록 조회 실패:', error);
        setLeagueList([]);
    }
  };

  // 경기 결과 조회
  const retrieveList = useCallback(async srchCond => {
    const retrieveListURL =
      '/api/retrieveMatchResult.do' +
      ApiFetch.getQueryString(srchCond);

    try {
      const resp = await ApiFetch.requestFetch(retrieveListURL, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      console.log('경기 결과 조회:', resp);

      setMatchList(resp.result.resultList || []);
      setPaginationInfo(resp.result.paginationInfo || {});
    } catch (error) {
      console.error('경기 결과 조회 실패:', error);
    }
  }, []);

  // 검색
  const handleSearch = () => {
    retrieveList({
      ...searchCondition,
      pageIndex: 1,
    });
  };

  // 날짜별 그룹화
  const groupedMatches = matchList.reduce((acc, match) => {
    if (!acc[match.matchDate]) {
      acc[match.matchDate] = [];
    }

    acc[match.matchDate].push(match);

    return acc;
  }, {});

  // 상태 표시
  const getStatus = match => {
    switch (match.status) {
      case 'FINISHED':
        return (
          <span className="text-gray-500 font-semibold">
            경기 종료
          </span>
        );

      case 'FIRST_HALF':
        return (
          <span className="text-blue-600 font-semibold">
            전반 {match.minute}'
          </span>
        );

      case 'HALF_TIME':
        return (
          <span className="text-orange-500 font-semibold">
            하프타임
          </span>
        );

      case 'SECOND_HALF':
        return (
          <span className="text-green-600 font-semibold">
            후반 {match.minute}'
          </span>
        );

      case 'POSTPONED':
        return (
          <span className="text-yellow-600 font-semibold">
            연기
          </span>
        );

      case 'CANCELLED':
        return (
          <span className="text-red-600 font-semibold">
            취소
          </span>
        );

      default:
        return (
          <span className="text-gray-400 font-semibold">
            경기 예정
          </span>
        );
    }
  };

  // 날짜 포맷
  const formatDate = date => {
    if (!date) return '';

    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    return `${month}/${day} (${dayOfWeek[d.getDay()]})`;
  };

  useEffect(() => {
    retrieveList(searchCondition);
  }, [retrieveList]);

  return (
    <main className="flex-1 bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold mb-8">경기 결과 조회</h3>

        {/* 검색 영역 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-8">
        <div className="flex items-center gap-4 flex-wrap">
            {/* 기간 */}
            <div className="flex items-center gap-2">
            <span className="text-sm font-medium">기간</span>
            <input
                type="date"
                value={searchCondition.startDate}
                onChange={e =>
                  setSearchCondition(prev => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="h-10 px-3 rounded border border-gray-300"
            />
            <span>~</span>
            <input
                type="date"
                value={searchCondition.endDate}
                onChange={e => 
                    setSearchCondition(prev => ({
                        ...prev,
                        endDate: e.target.value,
                    }))
                }
                className="h-10 px-3 rounded border border-gray-300"
            />
            </div>
            {/* 리그/대회 구분 */}
            <select 
                value={leagueType} 
                onChange={e => { 
                    const type = e.target.value;
                    setLeagueType(type); 
                    // 구분이 변경되면 기존 선택 초기화 
                    setSearchCondition(prev => ({ 
                        ...prev, 
                        type,
                        leagueId: '', 
                    })); 
                    retrieveLeagueList(type); 
                }}
                className="h-10 px-3 rounded border border-gray-300" > 
                    <option value="">전체</option> 
                    <option value="LEAGUE">리그</option> 
                    <option value="TOURNAMENT">대회</option> 
            </select>
            {/* 세부 리그/대회 */}
            <select 
                value={searchCondition.leagueId} 
                onChange={e => 
                    setSearchCondition(prev => ({ 
                        ...prev, 
                        leagueId: e.target.value, 
                    })) 
                } 
                disabled={!leagueType} 
                className="h-10 px-3 rounded border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400" 
            > 
                <option value=""> 
                    {leagueType === 'LEAGUE' ? '전체 리그' : leagueType === 'TOURNAMENT' ? '전체 대회' : '리그/대회 선택'} 
                </option> 
                
                {leagueList.map(league => ( 
                    <option 
                        key={league.leagueId} 
                        value={league.leagueId} 
                    > 
                        {league.name} 
                    </option>
                ))}
            </select>
            {/* 팀명 */}
            <input
              type="text"
              placeholder="팀명"
              value={searchCondition.keyword}
              onChange={e =>
                setSearchCondition(prev => ({
                  ...prev,
                  keyword: e.target.value,
                }))
              }
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="h-10 w-48 px-3 rounded border border-gray-300"
            />
            {/* 상태 */}
            {/* <select
              value={searchCondition.status}
              onChange={e =>
                setSearchCondition(prev => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="h-10 px-3 rounded border border-gray-300"
            >
                <option value="">전체 상태</option>
                <option value="SCHEDULED">경기 예정</option>
                <option value="FIRST_HALF">전반 진행중</option>
                <option value="HALF_TIME">하프타임</option>
                <option value="SECOND_HALF">후반 진행중</option>
                <option value="FINISHED">경기 종료</option>
                <option value="POSTPONED">연기</option>
                <option value="CANCELLED">취소</option>
            </select> */}
            <button
                onClick={handleSearch}
                className="h-10 px-6 bg-blue-600 text-white rounded hover:bg-blue-700">
                검색
            </button>
        </div>
        </div>

        {Object.entries(groupedMatches).map(([date, matches]) => (
            <div key={date} className="mb-8">

                {/* 날짜 */}
                <h3 className="text-xl font-bold mb-3 mt-8">
                {formatDate(date)}
                </h3>
                {/* 경기 결과 */}
                <div className="shadow rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                            <th className="px-3 py-3 w-16">No.</th>
                            <th className="px-3 py-3 w-24">시간</th>
                            <th className="px-3 py-3 w-50">구장</th>
                            <th className="w-[320px]">매치업</th>
                            <th className="w-[90px]">스코어</th>
                            <th className="w-[120px]">상태</th>
                            <th className="px-3 py-3 w-20">관리</th>
                        </tr>
                        </thead>

                        <tbody className="bg-white text-sm text-center">
                        {matches.map((match, index) => (
                            <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                            >
                            <td className="px-6 py-3">
                                {index + 1}
                            </td>

                            <td className="px-6 py-3">
                                {match.kickoffTime?.slice(0, 5)}
                            </td>

                            <td className="px-6 py-3">
                                {match.venueNm}
                            </td>

                            <td className="px-6 py-3 font-medium">
                                {match.homeTeamNm}
                                <span className="mx-2 text-gray-400">vs</span>
                                {match.awayTeamNm}
                            </td>

                            <td className="px-6 py-3 font-bold text-blue-600">
                                {match.status === 'SCHEDULED'
                                    ? '-'
                                    : `${match.homeScore} : ${match.awayScore}`}
                            </td>

                            <td className="px-6 py-3">
                                {getStatus(match)}
                            </td>

                            <td className="px-6 py-3 whitespace-nowrap">
                            <Link
                                to={`/admin/match/${match.matchId}`}
                                className="inline-flex items-center justify-center
                                        bg-blue-100 text-blue-800
                                        px-3 py-1 rounded
                                        text-xs font-semibold
                                        hover:bg-blue-200 transition"
                            >
                                상세
                            </Link>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            ))}
            
            {/* 검색 결과 없음 */}
            {matchList.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 py-12 text-center text-gray-500">
                검색 결과가 없습니다.
            </div>
            )}

            {/* 페이지네이션 */}
            <div className="mt-6">
            <Pagination
                pagination={paginationInfo}
                moveToPage={passedPage => {
                retrieveList({
                    ...searchCondition,
                    pageIndex: passedPage,
                });
                }}
            />
            </div>
      </div>
    </main>
  );
};

export default AdminMatchResult;