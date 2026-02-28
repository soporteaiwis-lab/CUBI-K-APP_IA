import { Inter } from 'next/font/google';
import './globals.css';
import { GlobalProvider } from '@/context/GlobalContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CUBI-K APP IA',
  description: 'Portal educativo conectado a Google Apps Script',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen`}>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}