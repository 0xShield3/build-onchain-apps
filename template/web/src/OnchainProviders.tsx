'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { createWagmiConfig } from '@/store/createWagmiConfig';
import { Shield3Provider } from '@shield3/react-sdk';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

const rpcUrl = '/api/rpc';

const wagmiConfig = createWagmiConfig(rpcUrl);

function OnchainProviders({ children }: Props) {
  return (
    <Shield3Provider apiKey={process.env.NEXT_PUBLIC_SHIELD3_API_KEY || ''}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider chain={baseSepolia}>{children}</OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Shield3Provider>
  );
}

export default OnchainProviders;
