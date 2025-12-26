// src/hooks/useReferrerValid.ts
import { useReadContract } from "wagmi";
import { SALE_ADDRESS } from "../dapp/contracts";
import { SALE_ABI } from "../dapp/abi";
import { Address } from "viem";

// 推荐人校验
export function useReferrerValid(referrer?: Address) {
  const { data } = useReadContract({
    address: SALE_ADDRESS,
    abi: SALE_ABI,
    functionName: "sharesBoughtOf",
    args: referrer ? [referrer] : undefined,
    query: { enabled: !!referrer },
  });

  return {
    valid: (data || 0n) > 0n,
  };
}
