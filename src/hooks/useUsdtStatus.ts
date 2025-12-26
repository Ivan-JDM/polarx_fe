// src/hooks/useUsdtStatus.ts
import { useReadContract } from "wagmi";
import { ERC20_ABI } from "../dapp/erc20_abi";
import { USDT_ADDRESS, SALE_ADDRESS } from "../dapp/contracts";
import { Address } from "viem";

// 用户USDT余额查询
export function useUsdtStatus(user?: Address) {
  const balance = useReadContract({
    address: USDT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: user ? [user] : undefined,
    query: { enabled: !!user },
  });

  const allowance = useReadContract({
    address: USDT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: user ? [user, SALE_ADDRESS] : undefined,
    query: { enabled: !!user },
  });

  return {
    balance: balance.data || 0n,
    allowance: allowance.data || 0n,
    loading: balance.isLoading || allowance.isLoading,
  };
}
