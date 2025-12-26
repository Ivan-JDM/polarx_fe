// src/web3/config.ts
import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "./chain";
import { walletConnect, injected } from "wagmi/connectors";
import { createPublicClient } from "viem";

export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    walletConnect({
      projectId: "5b0551d5d0222b378aa18c32c3dde663",
      showQrModal: true,
    }),
    injected(), // MetaMask / OKX / Bitget 内置
  ],
  transports: {
    [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
    [bsc.id]: http("https://bsc-dataseed.binance.org"),
  },
});

const publicClientTestnet = createPublicClient({
  chain: bscTestnet,
  transport: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
});

const publicClientMainnet = createPublicClient({
  chain: bsc,
  transport: http("https://bsc-dataseed.binance.org"),
});

export const publicClient = publicClientTestnet;
