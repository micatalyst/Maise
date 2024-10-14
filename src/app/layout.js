import '@/styles/Global.scss';
import '@/lib/fontawesome';
import StoreProvider from './StoreProvider';

import { Toaster } from 'sonner';

import Header from '@/components/Header';

export const metadata = {
  title: 'Arquivo UA',
  description: 'Arquivo UA, página com todos os conteúdos e as suas vertentes mais acessíveis',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  //maximumScale: 1,
  //userScalable: false,
  //shrinkToFit: 'yes', // Adicionando parâmetro extra, se necessário
};

/* <!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- <meta content="flex-basis=device-flex-basis, initial-scale=1, shrink-to-fit=no" name="viewport" /> -->
    <meta name="theme-color" content="#000000" />

    <meta
      content="Miguel_100402"
      name="author"
    />
    
    <title>MAISE</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html> */

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
