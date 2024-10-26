import React from 'react';
import ReactDOM from 'react-dom/client';  // Thay đổi import để dùng `createRoot`
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";

import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';

const rootElement = document.getElementById('root');

// Sử dụng createRoot thay vì ReactDOM.render
const root = ReactDOM.createRoot(rootElement);
root.render(
    <Provider store={reduxStore}>
        <IntlProviderWrapper>
            <App persistor={persistor} />
        </IntlProviderWrapper>
    </Provider>
);

// Đăng ký service worker nếu cần thiết
serviceWorker.unregister();
