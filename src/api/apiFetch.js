import { SERVER_URL } from '../config';

// 쿼리 스트링 생성
export function getQueryString(params) {
  return `?${Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`;
}

// Promise 기반 requestFetch
export async function requestFetch(url, requestOptions = {}) {
  console.groupCollapsed('requestFetch');
  console.log('URL:', SERVER_URL + url);

  try {
    const response = await fetch(SERVER_URL + url, {
      ...requestOptions,
      credentials: 'include', // 세션 쿠키 포함
    });

    console.log('status:', response.status);

    // 401 (인증 실패) 처리
    if (response.status === 401) {
      console.warn('인증 만료 → 로그인 페이지로 이동');
      //window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }

    // HTTP 에러 처리
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    // 응답 파싱 (빈 응답 대비)
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    console.log('response:', data);
    return data;
  } catch (error) {
    console.error('requestFetch error:', error);

    // 네트워크 에러 처리
    if (error.message === 'Failed to fetch') {
      alert('서버와의 연결이 원활하지 않습니다. 서버를 확인하세요.');
    }

    throw error; // 중요: 호출한 쪽에서 catch 가능하도록
  } finally {
    console.groupEnd();
  }
}
