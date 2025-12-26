// src/hooks/usePurchaseNode.ts
import { useState } from "react";
import { useAccount } from "wagmi";
import { NODE_PRICE } from "../dapp/price";
import { useApproveUsdt } from "./useApproveUsdt";
import { useBuyNode } from "./useBuyNode";
import { useUsdtStatus } from "./useUsdtStatus";
import { useUserPurchased } from "./useUserPurchased";
// import { useReferrerValid } from "./useReferrerValid";
import { Address, WriteContractReturnType } from "viem";
import { NODE_TIER } from "@/constants/common";
import toast from "react-hot-toast";
import { publicClient } from "@/dapp/config";

export function usePurchaseNode() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { hasPurchased } = useUserPurchased(address);
  const { approve, getAllowance } = useApproveUsdt();
  const { buyTier1, buyTier2, bindAndBuyTier1, bindAndBuyTier2 } = useBuyNode();
  const usdt = useUsdtStatus(address);

  const purchase = async (
    tier: NODE_TIER,
    referrer?: Address
  ): Promise<boolean | undefined> => {
    if (!address) {
      toast.error("钱包未连接");
      console.error("Wallet not connected");
      return;
    }
    setError(null);
    setLoading(true);
    console.log(tier);
    try {
      const price =
        tier === NODE_TIER.NORMAL ? NODE_PRICE.tier1 : NODE_PRICE.tier2;
      console.log("hasPurchased:", hasPurchased, referrer);
      if (!hasPurchased && !referrer) {
        // toast.error("请填写推荐人地址");
        console.error("请填写推荐人地址");
        return;
      }

      console.log("usdt.balance:", usdt.balance, price);
      if (usdt.balance < price) {
        // toast.error("USDT 余额不足");
        console.error("USDT 余额不足");
        return;
      }

      console.log("usdt.allowance:", usdt.allowance, price);
      if (usdt.allowance < price) {
        console.warn("USDT 授权不足");
        const hash = await approve(price);
        console.log("approve hash:", hash);
        if (hash) {
          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
          });
          console.log("receipt:", receipt);

          if (receipt.status !== "success") {
            // toast.error("USDT 授权失败");
            console.error("USDT 授权失败");
            return;
          }

          const onChainAllowance = await getAllowance();

          if (onChainAllowance && onChainAllowance < price) {
            // toast.error("授权未生效");
            console.error("授权未生效");
            return;
          }

          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      const nonce = await publicClient.getTransactionCount({
        address,
        blockTag: "pending",
      });

      if (hasPurchased) {
        console.log("hasPurchased:", hasPurchased);
        return tier === 1 ? await buyTier1(nonce) : await buyTier2(nonce);
      } else {
        console.log("noPurchased:", hasPurchased);
        return tier === 1
          ? await bindAndBuyTier1(referrer!, nonce)
          : await bindAndBuyTier2(referrer!, nonce);
      }
    } catch (e: any) {
      toast.error(e.message || "交易失败");
      console.error(e.message || "交易失败");
      setError(e.message || "交易失败");
    } finally {
      setLoading(false);
    }
  };

  return {
    purchase,
    loading,
    error,
  };
}
