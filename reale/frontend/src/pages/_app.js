import { useEffect } from 'react';
import { useStore } from '../store';
import '../styles/globals.css';
import Layout from '../components/Layout';
import AuthProvider from '../components/AuthProvider';
import SocketProvider from '../components/SocketProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  const { theme, setTheme } = useStore();

  useEffect(() => {
    // Set dark theme by default
    setTheme('dark');
    document.documentElement.classList.add('dark');
  }, [setTheme]);

  return (
    <AuthProvider>
      <SocketProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Layout>
      </SocketProvider>
    </AuthProvider>
  );
}

export default MyApp;
