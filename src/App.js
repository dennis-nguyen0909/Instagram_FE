import React, { useEffect, useState } from 'react';
import { routes } from '../src/routes/index';
import { Default } from './pages/DefaultPage/Default';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotFound } from './component/NotFound/NotFound';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, resetUser } from './redux/slides/userSlice';
import * as UserService from '../src/service/UserService';
import { jwtDecode } from 'jwt-decode';
import { isJsonString } from "./untils";
function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu với isLoading là true
  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
    setIsLoading(false); // Sau khi hoàn thành useEffect, isLoading sẽ chuyển thành false
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date();
    const { decoded } = handleDecoded();
    let storage = localStorage.getItem('refresh_token');
    const refreshToken = JSON.parse(storage);

    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (refreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken);
        config.headers['token'] = `Bearer ${data?.access_token}`;
      } else {
        dispatch(resetUser());
      }
    }
    return config;
  }, function (err) {
    return Promise.reject(err);
  });

  const handleGetDetailUser = async (id, access_token) => {
    let storage = localStorage.getItem('refresh_token');
    const refreshToken = JSON.parse(storage);
    const res = await UserService.getDetailUser(id, access_token);
    dispatch(updateUser({ ...res?.response.data, access_token: access_token, refreshToken }));
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? Default : Fragment;
              return (
                <Route key={route.path} path={route.path} element={
                  <Layout>
                    {route.isPrivate ? (
                      <NotFound />
                    ) : (
                      <Page />
                    )}
                  </Layout>
                }></Route >
              )
            })}
          </Routes >
        </Router >
      )}
    </div>
  );
}

export default App;
