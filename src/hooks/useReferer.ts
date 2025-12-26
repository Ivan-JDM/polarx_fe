// src/hooks/useReferrer.ts
import { useReadContract } from "wagmi";
import { SALE_ADDRESS } from "../dapp/contracts";
import { SALE_ABI } from "../dapp/abi";
import { Address } from "viem";

// 推荐人校验
export function useReferrer(ref?: Address) {
  const { data } = useReadContract({
    address: SALE_ADDRESS,
    abi: SALE_ABI,
    functionName: "sharesBoughtOf",
    args: ref ? [ref] : undefined,
    query: { enabled: !!ref },
  });

  return {
    valid: (data || 0n) > 0n,
  };
}
