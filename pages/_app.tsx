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
import { theme } from '../theme';


export default function App({ Component, pageProps }: AppProps) {
  const cssOverrides = `
    .button--padding-large {
      padding: 0.66rem 1rem;
    }
    @media (min-width: 768px) {
    .accordion-item {
      max-height: 100vh !important;
    }

    .modal, .dynamic-widget-modal, .dynamic-widget-card {
      right: 0 !important;
      top: 0 !important;
      transform: none !important;
      height: 100vh !important;
      border-radius: 0 !important;
      left: auto !important;
    }

    .wallet-list__scroll-container {
      max-height: 80vh !important;
    }

    .settings-view__body {
      height: auto !important;
    }

    .modal-card, .dynamic-widget-card {
      border-radius: 0 !important;
      background: linear-gradient(to bottom, #e6f3ff, #ffffff) !important;
    }

    .social-redirect-view__container, .wallet-no-access__container, .pending-signature__container, .pending-connect__container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin-top: -15%;
    }

    .footer-options-switcher__container {
      border-radius: 0 !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
    }

    .dynamic-user-profile-layout {
      height: 90vh !important;
    }

    .dynamic-footer, .tos-and-pp__footer {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
    }

    .tos-and-pp__footer {
      bottom: 30px !important;
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
        <Component {...pageProps} />
      </MantineProvider>
      </DynamicContextProvider>
  );
}