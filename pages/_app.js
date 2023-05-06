import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthContextProvider } from '../context/AuthContext';
import { Sidebar } from '../components';

const MyApp = ({ Component, pageProps }) => (
  <AuthContextProvider>
    <ThemeProvider attribute="class">
      <div className="flex">
        <Sidebar />
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  </AuthContextProvider>
);

export default MyApp;
