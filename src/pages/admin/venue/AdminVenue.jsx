import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import Pagination from '../../../components/common/Pagination';
import { Link, useLocation } from 'react-router-dom';
import CODE from '../../../constants/code';

const AdminVenue = () => {
  const location = useLocation();

  const [searchCondition, setSearchCondition] = useState(
    location.state?.searchCondition || {
      pageIndex: 1,
    },
  );

  const [paginationInfo, setPaginationInfo] = useState({});
  const [listTag, setListTag] = useState([]);

  const retrieveList = useCallback(async srchCond => {
    try {
      const retrieveListURL =
        '/api/retrieveVenue.do' + ApiFetch.getQueryString(srchCond);

      const resp = await ApiFetch.requestFetch(retrieveListURL, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      setPaginationInfo(resp.result.paginationInfo);

      let mutListTag = [];

      resp.result.resultList.forEach(item => {
        mutListTag.push(
          <tr key={item.venueId} className="border-b border-gray-200">
            <td className="px-6 py-3">{item.venueId}</td>
            <td className="px-6 py-3 font-medium">{item.venueNm}</td>
            <td className="px-6 py-3">{item.address}</td>
            <td className="px-6 py-3">
              <Link
                to={`/admin/venue/${item.venueId}/modify`}
                className="bg-green-100 text-green-800 px-3 py-1 text-xs rounded font-semibold hover:bg-green-200 transition mr-2"
              >
                수정
              </Link>

              <button
                onClick={() => handleOnDelete(item.venueId)}
                className="bg-red-100 text-red-800 px-3 py-1 text-xs rounded font-semibold hover:bg-red-200 transition"
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
            <td colSpan={5} className="py-10 text-center text-gray-500">
              검색결과가 없습니다.
            </td>
          </tr>,
        );
      }

      setListTag(mutListTag);
    } catch (e) {
      console.error(e);
      alert('목록 조회 실패');
    }
  }, []);

  const handleOnDelete = useCallback(
    async venueId => {
      if (!window.confirm('정말 삭제하시겠습니까?')) return;

      try {
        const deleteUrl = `/api/deleteVenue.do?venueId=${venueId}`;

        const resp = await ApiFetch.requestFetch(deleteUrl, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
        });

        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          alert('삭제되었습니다.');
          retrieveList(searchCondition);
        } else {
          alert('삭제 실패');
        }
      } catch (e) {
        console.error(e);
        alert('서버 오류');
      }
    },
    [retrieveList, searchCondition],
  );

  useEffect(() => {
    retrieveList(searchCondition);
  }, [retrieveList, searchCondition]);

  return (
    <main className="flex-1 bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold">경기장소 목록</h3>

        {/* 검색 */}
        <div className="mt-6">
          <input
            className="h-10 w-64 px-4 rounded-md bg-gray-50 border border-gray-200 focus:border-indigo-600 outline-none"
            type="text"
            placeholder="경기장 검색"
          />
        </div>

        {/* 리스트 */}
        <div className="mt-8">
          <div className="shadow rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">No.</th>
                  <th className="px-6 py-3 font-medium">장소명</th>
                  <th className="px-6 py-3 font-medium">주소</th>
                  <th className="px-6 py-3 font-medium">관리</th>
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

export default AdminVenue;
