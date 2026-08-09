import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import Pagination from '../../../components/common/Pagination.jsx';
import { Link, useLocation } from 'react-router-dom';

const AdminMatch = () => {
  const location = useLocation();

  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      pageIndex: 1,
    },
  );

  const [paginationInfo, setPaginationInfo] = useState({});
  const [listTag, setListTag] = useState([]);

  const retrieveList = useCallback(async srchCond => {
    const retrieveListURL =
      '/api/retrieveMatch.do' + ApiFetch.getQueryString(srchCond);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    try {
      const resp = await ApiFetch.requestFetch(retrieveListURL, requestOptions);

      setPaginationInfo(resp.result.paginationInfo);

      let mutListTag = [];

      resp.result.resultList.forEach((item, idx) => {
        mutListTag.push(
          <tr key={item.matchId} className="border-b border-gray-200">
            <td className="px-6 py-3">{idx + 1}</td>

            <td className="px-6 py-3">{item.leagueNm}</td>

            <td className="px-6 py-3">
              {item.homeTeamNm} vs {item.awayTeamNm}
            </td>

            <td className="px-6 py-3">
              {item.matchDate} {item.kickoffTime?.substring(0, 5)}
            </td>

            <td className="px-6 py-3">{item.venueNm}</td>

            <td className="px-6 py-3 whitespace-nowrap" colSpan={3}>
              <Link
                to={`/admin/match/${item.matchId}`}
                className="w-full bg-blue-100 text-blue-800 px-3 py-1 text-xs rounded font-semibold hover:bg-blue-200 transition"
              >
                경기 상세
              </Link>
            </td>
          </tr>,
        );
      });

      if (!mutListTag.length) {
        mutListTag.push(
          <tr key="empty">
            <td colSpan={5} className="py-10 text-center text-gray-500">
              검색결과가 없습니다.
            </td>
          </tr>,
        );
      }

      setListTag(mutListTag);
    } catch (error) {
      console.error('경기 목록 조회 실패:', error);
    }
  }, []);

  useEffect(() => {
    retrieveList(searchCondition);
  }, []);

  return (
    <main className="flex-1 bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">경기 목록</h3>

        {/* 검색 */}
        <div className="mt-6">
          <input
            className="h-10 w-64 px-4 rounded-md bg-gray-50 border border-gray-200 focus:border-indigo-600 outline-none"
            type="text"
            placeholder="경기명 검색"
          />
        </div>

        {/* 리스트 */}
        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium w-20">No.</th>

                  <th className="px-6 py-3 font-medium w-50">리그/대회명</th>

                  <th className="px-6 py-3 font-medium w-50">매치업</th>

                  <th className="px-6 py-3 font-medium w-45">경기일시</th>

                  <th className="px-6 py-3 font-medium w-40">장소</th>

                  <th className="px-6 py-3 font-medium w-20">관리</th>
                </tr>
              </thead>

              <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                {listTag}
              </tbody>
            </table>
          </div>
        </div>

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

export default AdminMatch;
