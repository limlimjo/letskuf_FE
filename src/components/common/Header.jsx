import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import URL from '../../constants/url';

const Header = () => {
  const { isLogin, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ pathname: URL.ADMIN_LOGIN });
  };

  return (
    <header className="flex justify-between items-center px-6 py-2 h-16 bg-white border-b-4 border-gray-800">
      <div />

      <div className="flex items-center gap-x-4">
        {isLogin && user && (
          <>
            {/* 인사 문구 */}
            <span className="text-sm text-gray-700">
              {user}님 안녕하세요 👋
            </span>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              로그아웃
            </button>
          </>
        )}

        {/* 프로필 */}
        <button className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
              user || 'guest'
            }`}
            alt="avatar"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
