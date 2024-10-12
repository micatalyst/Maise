import '@/styles/Global.scss';
import '@/lib/fontawesome';
import StoreProvider from './StoreProvider';

import { Toaster } from 'sonner';

import Header from '@/components/Header';

export const metadata = {
  title: 'Arquivo UA',
  description: 'Arquivo UA, página com todos os conteúdos e as suas vertentes mais acessíveis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <StoreProvider>
          <Header />
          {children}
          <Toaster
            position="top-right"
            richColors
          />
        </StoreProvider>
      </body>
    </html>
  );
}
