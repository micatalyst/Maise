import '@/styles/Global.scss';
import '@/lib/fontawesome';
import StoreProvider from './StoreProvider';

import Header from '@/components/Header';

export const metadata = {
  title: 'MAISE',
  description: 'Projeto Final do Mestrado MCTW',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <StoreProvider>
          <Header />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
