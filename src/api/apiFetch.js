import { SERVER_URL } from '../config';

export function getQueryString(params) {
  return `?${Object.entries(params)
    .map(e => e.join('='))
    .join('&')}`;
}

export function requestFetch(url, requestOptions, handler, errorHandler) {
  console.log('requestFetch');
  console.log(SERVER_URL + url);

  //CORS 에러 이슈
  //   if (!requestOptions['origin']) {
  //     requestOptions = { ...requestOptions, origin: SERVER_URL };
  //   }
  //   if (!requestOptions['credentials']) {
  //     requestOptions = { ...requestOptions, credentials: 'include' };
  //   }

  fetch(SERVER_URL + url, requestOptions)
    .then(response => {
      return response.json();
    })
    .then(resp => {
      console.groupCollapsed('requestFetch.then()');
      console.log('requestFetch [response] ', resp);
      if (typeof handler === 'function') {
        handler(resp);
      } else {
        console.log('fetch handler not assigned!');
      }
      console.groupEnd('requestFetch.then()');
    })
    .catch(error => {
      console.error('There was an error!', error);
      if (error === 'TypeError: Failed to fetch') {
        alert('서버와의 연결이 원활하지 않습니다. 서버를 확인하세요.');
      }
      if (typeof errorHandler === 'function') {
        errorHandler(error);
      } else {
        console.error('error handler not assigned!');
        alert('ERR : ' + error.message);
      }
    })
    .finally(() => {
      console.log('requestFetch finally end');
      console.groupEnd('requestFetch');
    });
}
