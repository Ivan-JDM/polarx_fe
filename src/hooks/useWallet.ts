// src/hooks/useWallet.ts
import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isError, error } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isError && error) {
      console.error("WalletConnect error:", error);
      alert(error.message ?? "Wallet connect failed");
    }
  }, [isError, error]);

  return {
    address,
    isConnected,
    connect,
    connectors,
    disconnect,
  };
}
