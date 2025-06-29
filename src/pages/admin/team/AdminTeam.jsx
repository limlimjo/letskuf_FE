import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import Pagination from '../../../components/Pagination';
import { useLocation } from 'react-router-dom';

const AdminTeam = () => {
  const location = useLocation();

  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      pageIndex: 1,
    },
  ); // 기존 조회에서 접근 했을 시 || 신규로 접근 했을 시
  const [paginationInfo, setPaginationInfo] = useState({});
  const [listTag, setListTag] = useState([]);

  const retrieveList = useCallback(
    srchCond => {
      console.log('useCallback 시작');

      const retrieveListURL =
        '/api/retrieveTeam.do' + ApiFetch.getQueryString(srchCond);
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
              <td className="px-6 py-4">{item.teamId}</td>
              <td className="px-6 py-4">{item.teamNm}</td>
              <td className="px-6 py-4">{item.regionNm}</td>
              <td className="px-6 py-4">{item.coachNm}</td>
              <td className="px-6 py-4">
                <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-full font-semibold">
                  수정
                </span>
              </td>
            </tr>,
          );
        });

        if (!mutListTag.length) {
          mutListTag.push(
            <tr className="border-b border-gray-200">검색결과가 없습니다.</tr>,
          );
        }
        setListTag(mutListTag);
      });
    },
    [listTag, searchCondition],
  );

  useEffect(() => {
    retrieveList(searchCondition);
  }, []);

  return (
    <main className="flex-1 bg-gray-200">
      <div className="container mx-auto px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">팀 목록</h3>
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
                  <th className="px-6 py-3 font-medium">팀명</th>
                  <th className="px-6 py-3 font-medium">지역</th>
                  <th className="px-6 py-3 font-medium">감독</th>
                  <th className="px-6 py-3 font-medium">수정</th>
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

export default AdminTeam;
