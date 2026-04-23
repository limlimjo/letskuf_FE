import { Navigate, Route, Routes } from 'react-router-dom';
import RootRoutes from './routes/RootRoutes.jsx';
import React, { useEffect } from 'react';
import AdminLogin from './pages/admin/login/AdminLogin.jsx';
import URL from './constants/url.js';
import useAuthStore from './store/useAuthStore.js';

function App() {
  const { isLogin, checkLogin } = useAuthStore();

  useEffect(() => {
    checkLogin();
  }, []);

  console.log('isLogin 출력:', isLogin);

  if (isLogin === null) {
    return (
      <div className="flex items-center justify-center h-screen">로딩중...</div>
    );
  }

  return (
    <>
      <body className="min-w-[80rem] bg-gray-100">
        <div className="flex min-h-screen">
          <React.StrictMode>
            <Routes>
              {/* 기본 진입 -> 로그인 */}
              <Route path="/" element={<Navigate to={URL.ADMIN_LOGIN} />} />

              {/* 로그인 */}
              <Route
                path={URL.ADMIN_LOGIN}
                element={
                  isLogin ? <Navigate to={URL.ADMIN_TEAM} /> : <AdminLogin />
                }
              />

              {/* 관리자 전체 */}
              <Route
                path="/admin/*"
                element={
                  isLogin ? <RootRoutes /> : <Navigate to={URL.ADMIN_LOGIN} />
                }
              />
            </Routes>
          </React.StrictMode>
        </div>
      </body>
    </>
  );
}

export default App;
