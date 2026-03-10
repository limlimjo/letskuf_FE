import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import Pagination from '../../../components/Pagination';
import { Link, useLocation } from 'react-router-dom';
import CODE from '../../../constants/code';

const AdminPlayer = () => {
  const location = useLocation();

  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      pageIndex: 1,
    },
  );

  const [paginationInfo, setPaginationInfo] = useState({});
  const [listTag, setListTag] = useState([]);

  const retrieveList = useCallback(
    srchCond => {
      const retrieveListURL =
        '/api/retrievePlayer.do' + ApiFetch.getQueryString(srchCond);

      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      };

      ApiFetch.requestFetch(retrieveListURL, requestOptions, resp => {
        setPaginationInfo(resp.result.paginationInfo);

        let mutListTag = [];

        resp.result.resultList.forEach((item, index) => {
          mutListTag.push(
            <tr
              key={item.playerId}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-6 py-3">{item.playerId}</td>

              <td className="px-6 py-3">{item.name}</td>

              <td className="px-6 py-3">{item.teamNm}</td>

              <td className="px-6 py-3">{item.position}</td>

              <td className="px-6 py-3">{item.uniformNum}</td>

              <td className="px-6 py-3">{item.grade}</td>

              <td className="px-6 py-3">
                <Link
                  to={`/admin/player/${item.playerId}/modify`}
                  className="bg-green-100 text-green-800 px-3 py-1 text-xs rounded font-semibold hover:bg-green-200 mr-2"
                >
                  수정
                </Link>

                <button
                  onClick={() => handleOnDelete(item.playerId)}
                  className="bg-red-100 text-red-800 px-3 py-1 text-xs rounded font-semibold hover:bg-red-200"
                >
                  삭제
                </button>
              </td>
            </tr>,
          );
        });

        if (!mutListTag.length) {
          mutListTag.push(
            <tr key="empty">
              <td colSpan={7} className="py-10 text-center text-gray-500">
                검색결과가 없습니다.
              </td>
            </tr>,
          );
        }

        setListTag(mutListTag);
      });
    },
    [searchCondition],
  );

  const handleOnDelete = useCallback(
    playerId => {
      if (!window.confirm('정말 삭제하시겠습니까?')) return;

      const deleteUrl = `/api/deletePlayer.do?playerId=${playerId}`;

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      };

      ApiFetch.requestFetch(deleteUrl, requestOptions, resp => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          alert('삭제되었습니다.');
          retrieveList(searchCondition);
        } else {
          alert('삭제에 실패했습니다.');
        }
      });
    },
    [retrieveList, searchCondition],
  );

  useEffect(() => {
    retrieveList(searchCondition);
  }, []);

  return (
    <main className="flex-1 bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">선수단 목록 (선수)</h3>

        {/* 검색 */}
        <div className="relative mt-6">
          <input
            className="h-10 w-64 px-4 rounded-md bg-white border border-gray-300 focus:outline-none focus:border-indigo-500"
            type="text"
            placeholder="선수 검색"
          />
        </div>

        {/* 리스트 */}
        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-xs text-gray-500 text-center">
                  <th className="px-6 py-3 font-medium">No</th>

                  <th className="px-6 py-3 font-medium">이름</th>

                  <th className="px-6 py-3 font-medium">소속</th>

                  <th className="px-6 py-3 font-medium">포지션</th>

                  <th className="px-6 py-3 font-medium">배번</th>

                  <th className="px-6 py-3 font-medium">학년</th>

                  <th className="px-6 py-3 font-medium">관리</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-900 text-center font-medium">
                {listTag}
              </tbody>
            </table>
          </div>
        </div>

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
    </main>
  );
};

export default AdminPlayer;
