import React from 'react';
import { Provider } from 'react-redux';
import 'styles/global.scss';
import 'styles/components/index.scss';
import NavbarCustom from 'components/NavbarCustom';
import Footer from 'components/Footer';
import { AuthProvider } from 'util/auth';
import { QueryClientProvider } from 'util/db';
import store from 'store';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <QueryClientProvider>
        <AuthProvider>
          <>
            <NavbarCustom
              bg="white"
              variant="light"
              expand="md"
              logo="https://uploads.divjoy.com/logo.svg"
            />

            <Component {...pageProps} />

            <Footer
              bg="white"
              textColor="dark"
              size="md"
              bgImage=""
              bgImageOpacity={1}
              description="A short description of what you do here"
              copyright={`© ${new Date().getFullYear()} Company`}
              logo="https://uploads.divjoy.com/logo.svg"
            />
          </>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
