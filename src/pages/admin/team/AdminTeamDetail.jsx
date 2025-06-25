const AdminTeamDetail = () => {
  return (
    <main className="flex-1 bg-gray-200">
      <div className="container mx-auto px-10 py-8">
        <div className="flex items-center gap-x-3">
          <span className="w-10 h-10 rounded-full overflow-hidden border-1">
            {/* <img src="" alt="univ" /> */}
          </span>
          <h3 className="text-gray-700 text-3xl font-bold">한국대학교</h3>
        </div>

        <div className="flex gap-8 mt-10">
          <div className="w-2/5">
            <div>
              <h2 className="text-gray-700 text-2xl font-bold">지도자</h2>
              <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                      <th className="px-4 py-3 font-medium">이름</th>
                      <th className="px-6 py-3 font-medium">직함</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-4">김철수</td>
                      <td className="px-6 py-4">감독</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-gray-700 text-2xl font-bold">임원</h2>
              <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                      <th className="px-6 py-3 font-medium">이름</th>
                      <th className="px-6 py-3 font-medium">직함</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4">김철수</td>
                      <td className="px-6 py-4">총장</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-3/5">
            <h2 className="text-gray-700 text-2xl font-bold">선수</h2>
            <div className="mt-4 shadow rounded-lg overflow-hidden border-b border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-xs text-center text-gray-500 border-b border-gray-200">
                    <th className="px-6 py-3 font-medium">배번</th>
                    <th className="px-6 py-3 font-medium">이름</th>
                    <th className="px-6 py-3 font-medium">포지션</th>
                    <th className="px-6 py-3 font-medium">학년</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-gray-900 text-sm text-center font-medium">
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4">1</td>
                    <td className="px-6 py-4">김선수</td>
                    <td className="px-6 py-4">DF</td>
                    <td className="px-6 py-4">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminTeamDetail;
