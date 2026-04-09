import { useCallback, useEffect, useState } from 'react';
import * as ApiFetch from '../../../api/apiFetch';
import Button from '../../../components/Button';
import CODE from '../../../constants/code';
import { useParams } from 'react-router-dom';
import Pagination from '../../../components/Pagination';

const AdminLeagueDetail = () => {
  const { leagueId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [leagueInfo, setLeagueInfo] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    startDate: '',
    endDate: '',
  });
  const [keyword, setKeyword] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const [searchVenueList, setSearchVenueList] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});

  const [venueList, setVenueList] = useState([]);

  const retrieveList = useCallback(() => {
    const retrieveListURL =
      '/api/retrieveLeagueDetail.do' + ApiFetch.getQueryString({ leagueId });

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    ApiFetch.requestFetch(retrieveListURL, requestOptions, resp => {
      setLeagueInfo(resp.result.league || {});
      setVenueList(resp.result.venue || []);
    });
  }, [leagueId]);

  // 취소 버튼 클릭
  const handleOnCancel = () => {
    setIsEditing(false);
  };

  // 리그/대회 수정 버튼 클릭
  const handleEditOrSave = useCallback(() => {
    if (isEditing) {
      const sendData = { ...formData, leagueId };

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(sendData),
      };

      ApiFetch.requestFetch('/api/updateLeague.do', requestOptions, resp => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          alert('리그/대회 정보가 수정되었습니다.');
          setIsEditing(false);
          retrieveList();
        } else {
          alert('리그/대회 정보 수정 실패');
        }
      });
    } else {
      setFormData(leagueInfo);
      setIsEditing(true);
    }
  }, [isEditing, formData, leagueId, leagueInfo, retrieveList]);

  // 경기장 검색 버튼 클릭
  const handleSearchVenue = pageIndex => {
    if (!keyword.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    setIsSearched(true);

    const searchURL =
      '/api/searchVenue.do' +
      ApiFetch.getQueryString({
        keyword,
        pageIndex: pageIndex || 1,
      });

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    ApiFetch.requestFetch(searchURL, requestOptions, resp => {
      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        setSearchVenueList(resp.result.resultList || []);
        setPaginationInfo(resp.result.paginationInfo || {});
      } else {
        alert('경기장 검색 실패');
      }
    });
  };

  // 경기장 추가 버튼 클릭
  const handleAddVenue = item => {
    console.log('item 출력: ' + item.venueId);
    console.log('leagueId 출력: ' + leagueId);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        leagueId,
        venueId: item.venueId,
      }),
    };

    ApiFetch.requestFetch(
      '/api/registerLeagueVenue.do',
      requestOptions,
      resp => {
        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
          alert('경기장이 추가되었습니다.');
          // 현재 사용 경기장 목록 업데이트
          setVenueList(prev => [
            ...prev,
            {
              venueId: item.venueId,
              name: item.venueNm,
              address: item.address,
            },
          ]);
        } else {
          alert(resp.resultMessage || '경기장 추가 실패');
        }
      },
    );
  };

  // 경기장 삭제 버튼 클릭
  const handleDeleteVenue = item => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        leagueId,
        venueId: item.venueId,
      }),
    };

    ApiFetch.requestFetch('/api/deleteLeagueVenue.do', requestOptions, resp => {
      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        alert('경기장이 삭제되었습니다.');

        setVenueList(prev => prev.filter(v => v.venueId !== item.venueId));
      } else {
        alert('삭제 실패');
      }
    });
  };

  useEffect(() => {
    retrieveList();
  }, [retrieveList]);

  useEffect(() => {
    if (!isEditing && leagueInfo?.leagueId) {
      setFormData({
        name: leagueInfo.name || '',
        region: leagueInfo.region || '',
        startDate: leagueInfo.startDate || '',
        endDate: leagueInfo.endDate || '',
      });
    }
  }, [leagueInfo, isEditing]);

  return (
    <main className="bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold mb-6">
          리그/대회 관리
        </h3>

        {/* 리그/대회 수정 */}
        <div>
          <h2 className="text-gray-700 text-2xl font-bold">리그/대회 수정</h2>
          <div className="flex flex-col gap-6 bg-white p-6 mt-4 rounded-lg shadow">
            {/* 리그명 */}
            <div className="flex items-center">
              <span className="font-bold w-32">리그/대회명</span>

              <input
                className="h-10 w-130 px-6 rounded bg-gray-100"
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            {/* 지역 */}
            <div className="flex items-center">
              <span className="font-bold w-32">지역</span>

              <select
                className="h-10 w-56 px-6 bg-gray-100 rounded"
                value={formData.region}
                onChange={e =>
                  setFormData({ ...formData, region: e.target.value })
                }
                disabled={!isEditing}
              >
                <option value="">선택</option>
                <option value="전국">전국</option>
                <option value="서울">서울</option>
                <option value="인천">인천</option>
                <option value="경기">경기</option>
                <option value="강원">강원</option>
                <option value="경북">경북</option>
                <option value="경남">경남</option>
                <option value="전북">전북</option>
                <option value="전남">전남</option>
                <option value="제주">제주</option>
              </select>
            </div>

            {/* 기간 */}
            <div className="flex items-center">
              <span className="font-bold w-32">기간</span>

              {isEditing ? (
                <>
                  <input
                    className="h-10 w-56 px-6 rounded bg-gray-100 text-center"
                    type="date"
                    value={formData.startDate}
                    onChange={e =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />

                  <span className="mx-2">~</span>

                  <input
                    className="h-10 w-56 px-6 rounded bg-gray-100 text-center"
                    type="date"
                    value={formData.endDate}
                    onChange={e =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </>
              ) : (
                <div className="w-70 px-6 py-2 bg-gray-100 rounded">
                  {leagueInfo.startDate && leagueInfo.endDate
                    ? `${leagueInfo.startDate.replace(/-/g, '.')} ~ ${leagueInfo.endDate.replace(/-/g, '.')}`
                    : '기간 없음'}
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-4">
              {isEditing && (
                <Button
                  className="bg-gray-100 text-black px-8 py-2 rounded"
                  onClick={handleOnCancel}
                >
                  취소
                </Button>
              )}
              <Button
                className="bg-black text-white px-8 py-2 rounded"
                onClick={handleEditOrSave}
              >
                {isEditing ? '저장' : '수정'}
              </Button>
            </div>
          </div>
        </div>
        {/* 사용 경기장 */}
        <div className="mt-10">
          <h2 className="text-gray-700 text-2xl font-bold">사용 경기장</h2>
          <div className="flex flex-col gap-4 mt-4 bg-white p-6 rounded-lg shadow">
            {/* 경기장 검색 */}
            <div className="flex items-center gap-3">
              <span className="font-bold w-32">경기장 검색</span>
              <input
                className="h-10 w-80 px-3 bg-gray-100 rounded"
                placeholder="경기장 이름 검색"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearchVenue(1);
                  }
                }}
              />

              <Button
                className="h-10 px-6 bg-black text-white rounded"
                onClick={() => handleSearchVenue(1)}
              >
                검색
              </Button>
            </div>
            {/* 검색 결과 */}
            {isSearched && (
              <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                      <th className="px-6 py-3 font-medium w-20">No.</th>
                      <th className="px-6 py-3 font-medium">경기장명</th>
                      <th className="px-6 py-3 font-medium">주소</th>
                      <th className="px-6 py-3 font-medium w-32">관리</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                    {searchVenueList.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-6 text-gray-500">
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      searchVenueList.map((item, idx) => {
                        const isAdded = venueList.some(
                          v => v.venueId === item.venueId,
                        );
                        return (
                          <tr
                            key={item.venueId}
                            className="border-b border-gray-200"
                          >
                            <td className="px-6 py-3">{idx + 1}</td>

                            <td className="px-6 py-3 font-medium">
                              {item.venueNm}
                            </td>

                            <td className="px-6 py-3">{item.address}</td>

                            <td className="px-6 py-3">
                              <button
                                disabled={isAdded}
                                onClick={() => handleAddVenue(item)}
                                className={`px-3 py-1 text-xs rounded font-semibold transition
                                ${
                                  isAdded
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                }`}
                              >
                                {isAdded ? '추가됨' : '추가'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* 페이지네이션 */}
            {isSearched && (
              <Pagination
                pagination={paginationInfo}
                moveToPage={passedPage => {
                  handleSearchVenue(passedPage);
                }}
              />
            )}
          </div>
        </div>
        {/* 추가 경기장 목록 */}
        <div className="mt-5">
          <div className="flex flex-col gap-4 mt-4 bg-white p-6 rounded-lg shadow">
            <span className="font-bold w-32">추가 경기장 목록</span>
            <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                    <th className="px-6 py-3 font-medium w-20">No.</th>
                    <th className="px-6 py-3 font-medium">경기장명</th>
                    <th className="px-6 py-3 font-medium">주소</th>
                    <th className="px-6 py-3 font-medium w-32">관리</th>
                  </tr>
                </thead>

                <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                  {venueList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-6 text-gray-500">
                        등록된 경기장이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    venueList.map((item, idx) => (
                      <tr
                        key={item.venueId}
                        className="border-b border-gray-200"
                      >
                        <td className="px-6 py-3">{idx + 1}</td>

                        <td className="px-6 py-3 font-medium">{item.name}</td>

                        <td className="px-6 py-3">{item.address}</td>

                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleDeleteVenue(item)}
                            className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded hover:bg-red-200 cursor-pointer"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLeagueDetail;
