import { message } from 'antd';
import { extend } from 'umi-request';
import { history } from 'umi';
import { stringify } from 'querystring';
const request = extend({
  credentials: 'include',
  prefix:process.env.NODE_ENV === 'production' ? 'http://43.139.40.182' : undefined,
});

request.interceptors.request.use((url, options) => {
  // console.log('request', url, options);
  return {
    url,
    options: { ...options, headers: {} },
  };
});

request.interceptors.response.use(async (response) => {
  const res = await response.clone().json();
  if (res.code === 0) {
    return res.data;
  }
  if (res.code === 40100) {
    message.error('未登录');
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: location.pathname,
      }),
    });
  } else {
    message.error(res.description);
  }
  return res.data;
});
export default request;
