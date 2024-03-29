/**
 * Root component of the application
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { SidePanelProvider } from '@/context';
import { AppProps } from 'next/app';
import { Roboto } from 'next/font/google';

import '@/styles/globals.css';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SidePanelProvider>
        <div
          className={`h-screen w-screen overflow-hidden ${roboto.className}`}
        >
          <Component {...pageProps} />
        </div>
      </SidePanelProvider>
    </>
  );
}

export default MyApp;
