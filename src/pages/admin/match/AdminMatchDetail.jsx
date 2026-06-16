const AdminMatchDetail = () => {
  return (
    <main className="bg-gray-200 min-h-screen">
      <div className="max-w-[1140px] px-10 py-8">
        <h3 className="text-gray-700 text-3xl font-bold mb-6">경기 상세</h3>
        {/* 경기 정보 */}
        <div className="flex flex-col gap-4 bg-white p-6 mt-4 rounded-lg shadow">
          <div className="flex items-center">
            <span className="font-bold w-32">리그/대회</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold w-32">경기일시</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold w-32">경기장</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold w-32">상태</span>
          </div>
        </div>
        {/* 매치업 정보 */}
        <div className="bg-white p-8 mt-4 rounded-lg shadow">
          <div className="flex items-center justify-center">
            <div className="flex-1 text-center">
              <div className="text-sm text-gray-500 mb-2">HOME</div>

              <div className="text-3xl font-bold">김천대학교</div>
            </div>

            <div className="px-10 text-4xl font-bold text-gray-400">VS</div>

            <div className="flex-1 text-center">
              <div className="text-sm text-gray-500 mb-2">AWAY</div>

              <div className="text-3xl font-bold">건국대학교</div>
            </div>
          </div>
        </div>
        {/* 라인업 등록 및 실시간 시작, 수정/취소/연기/삭제 버튼 */}
        <div className="bg-white p-6 mt-4 rounded-lg shadow">
          <h4 className="text-lg font-bold text-gray-700 mb-4">경기 관리</h4>
          {/* 주요 액션 */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
              라인업 등록
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition shadow-sm">
              실시간 시작
            </button>
          </div>
          {/* 보조 액션 */}
          <div className="flex justify-end gap-3">
            <button className="px-5 py-2.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              수정
            </button>
            <button className="px-5 py-2.5 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition">
              연기
            </button>
            <button className="px-5 py-2.5 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition">
              취소
            </button>
            <button className="px-5 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
              삭제
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminMatchDetail;
