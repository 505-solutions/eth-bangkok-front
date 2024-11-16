import '@mantine/core/styles.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import {
  DynamicContextProvider,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { EthersExtension } from '@dynamic-labs/ethers-v5';
import { useEffect, useRef } from 'react';
import { theme } from '../theme';

export default function App({ Component, pageProps }: AppProps) {
  const cssOverrides = `
    .button--padding-large {
      padding: 0.66rem 1rem;
    }
  `;

  // Setting up list of evmNetworks
  const evmNetworks = [
    {
      blockExplorerUrls: ['https://coston-explorer.flare.network'],
      chainId: 16,
      chainName: 'Coston',
      iconUrls: ['https://docs.flare.network/assets/images/dev/reference/logo-FLR.png'],
      name: 'Coston',
      nativeCurrency: {
        decimals: 18,
        name: 'Coston',
        symbol: 'CFLR',
        iconUrl: 'https://docs.flare.network/assets/images/dev/reference/logo-FLR.png',
      },
      networkId: 1,

      rpcUrls: ['https://coston-api.flare.network/ext/bc/C/rpc'],
      vanityName: 'Coston',
    },
  ];

  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect: any;
    const loadVanta = () => {
      if (vantaRef.current && !vantaEffect) {
        vantaEffect = window.VANTA.WAVES({
          el: vantaRef.current,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xca97c1,
          shininess: 20.00,
          waveHeight: 12.00,
          waveSpeed: 1.15,
          zoom: 1.40,
        });
      }
    };

    // Load Vanta after the scripts are loaded
    if (typeof window !== 'undefined' && window.VANTA) {
      loadVanta();
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
      <DynamicContextProvider
        settings={{
        environmentId: 'a2dea8be-028b-4848-a65f-a57fe56a8770',
        walletConnectors: [EthereumWalletConnectors],
        walletConnectorExtensions: [EthersExtension],
        overrides: { evmNetworks },
        cssOverrides,
      }}
    >
      <MantineProvider theme={theme}>
        <Head>
          <title>Mantine Template</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.svg" />
        </Head>
        <div
          ref={vantaRef}
          style={{
                  position: 'fixed',
                  width: '100%',
                  height: '100vh',
                  zIndex: -1,
                }}
              >
        </div>
        <Component {...pageProps} />
      </MantineProvider>
      </DynamicContextProvider>
  );
}
