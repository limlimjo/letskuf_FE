import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ApiFetch from '../../../api/apiFetch';
import useAuthStore from '../../../store/useAuthStore';
import URL from '../../../constants/url';

const AdminLogin = () => {
  const { setIsLogin, setUser } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      await ApiFetch.requestFetch('/api/login', {
        method: 'POST',
        body: formData,
      });

      const user = await ApiFetch.requestFetch('/api/me'); // 세션 확인

      setIsLogin(true);
      setUser(user.result.username);

      alert('로그인 성공');
      navigate({ pathname: URL.ADMIN_TEAM });
    } catch (e) {
      alert('로그인 실패');
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* 타이틀 */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          관리자 로그인
        </h2>

        {/* 아이디 입력 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
