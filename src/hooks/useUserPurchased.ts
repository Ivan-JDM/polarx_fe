// src/hooks/useUserPurchased.ts
import { useReadContract } from "wagmi";
import { SALE_ADDRESS } from "../dapp/contracts";
import { SALE_ABI } from "../dapp/abi";
import { Address } from "viem";

// 是否已入金
export function useUserPurchased(address?: Address) {
  const { data, isLoading } = useReadContract({
    address: SALE_ADDRESS,
    abi: SALE_ABI,
    functionName: "sharesBoughtOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    hasPurchased: (data || 0n) > 0n,
    shares: data || 0n,
    loading: isLoading,
  };
}
