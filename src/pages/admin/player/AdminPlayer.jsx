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
      console.log('useCallback 시작');

      const retrieveListURL =
        '/api/retrievePlayer.do' + ApiFetch.getQueryString(srchCond);
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      };

      ApiFetch.requestFetch(retrieveListURL, requestOptions, resp => {
        console.log('api 호출결과');
        console.log(resp);
        setPaginationInfo(resp.result.paginationInfo);
        let mutListTag = [];

        const resultCnt = parseInt(resp.result.resultCnt);
        const currentPageNo = resp.result.paginationInfo.currentPageNo;
        const pageSize = resp.result.paginationInfo.pageSize;

        // 리스트 항목
        resp.result.resultList.forEach(function (item, index) {
          if (index === 0) mutListTag = [];
          //const listIdx = itemIdxByPage(resultCnt, currentPageNo, pageSize, index);

          mutListTag.push(
            <tr className="border-b border-gray-200">
              <td className="px-6 py-4">{item.playerId}</td>
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.teamNm}</td>
              <td className="px-6 py-4">{item.position}</td>
              <td className="px-6 py-4">{item.uniformNum}</td>
              <td className="px-6 py-4">{item.grade}</td>
              <td className="px-6 py-4" colSpan={2}>
                <Link
                  to={`/admin/player/${item.playerId}/modify`}
                  className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-full font-semibold hover:bg-green-200 transition mr-2"
                >
                  수정
                </Link>
                <button
                  onClick={() => handleOnDelete(item.playerId)}
                  className="bg-red-100 text-red-800 px-2 py-0.5 text-xs rounded-full font-semibold hover:bg-red-200 transition"
                >
                  삭제
                </button>
              </td>
            </tr>,
          );
        });

        if (!mutListTag.length) {
          mutListTag.push(
            <tr className="border-b border-gray-200">
              <td colSpan={6} className="py-8 text-center text-gray-500">
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

  // 삭제 버튼 클릭 핸들러
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
        console.log('삭제 결과:', resp);
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          alert('삭제되었습니다.');
          retrieveList(searchCondition); // 삭제 후 리스트 갱신
        } else {
          alert('삭제에 실패했습니다. 다시 시도해주세요.');
        }
      });
    },
    [retrieveList, searchCondition],
  );

  useEffect(() => {
    retrieveList(searchCondition);
  }, []);

  return (
    <main className="flex-1 bg-gray-200">
      <div className="container mx-auto px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">선수단 목록 (선수)</h3>
        <div className="relative mt-6">
          <span className="absolute left-0 inset-y-0 pl-3 flex items-center">
            <i className="fas fa-search" />
          </span>
          <input
            className="focus:border-indigo-600 h-10 w-64 pl-10 pr-4 rounded-md bg-gray-50"
            type="text"
          />
        </div>
        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border-b border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">No.</th>
                  <th className="px-6 py-3 font-medium">이름</th>
                  <th className="px-6 py-3 font-medium">소속</th>
                  <th className="px-6 py-3 font-medium">포지션</th>
                  <th className="px-6 py-3 font-medium">배번</th>
                  <th className="px-6 py-3 font-medium">학년</th>
                  <th className="px-6 py-3 font-medium" colSpan={2}>
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
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
