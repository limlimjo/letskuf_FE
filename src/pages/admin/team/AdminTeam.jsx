const AdminTeam = () => {
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
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4">1</td>
                  <td className="px-6 py-4">한국대학교</td>
                  <td className="px-6 py-4">서울</td>
                  <td className="px-6 py-4">김철수</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-full font-semibold">
                      수정
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminTeam;
