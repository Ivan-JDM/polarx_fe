// src/hooks/useBuyNode.ts
import { useAccount, useWriteContract, useWalletClient } from "wagmi";
import { SALE_ADDRESS } from "../dapp/contracts";
import { SALE_ABI } from "../dapp/abi";
import { Address, Hash } from "viem";
import toast from "react-hot-toast";
import { publicClient } from "@/dapp/config";

export function useBuyNode() {
  // const { writeContract } = useWriteContract();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  // async function buy(
  //   tier: 1 | 2,
  //   referrer?: `0x${string}`,
  //   hasBought?: boolean
  // ) {
  //   if (!hasBought && !referrer) {
  //     console.error("缺少推荐人");
  //     return;
  //   }

  //   if (hasBought) {
  //     walletClient
  //       ?.writeContract({
  //         address: SALE_ADDRESS,
  //         abi: SALE_ABI,
  //         functionName: tier === 1 ? "buyTier1" : "buyTier2",
  //         account: address,
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } else {
  //     walletClient
  //       ?.writeContract({
  //         address: SALE_ADDRESS,
  //         abi: SALE_ABI,
  //         functionName: tier === 1 ? "bindAndBuyTier1" : "bindAndBuyTier2",
  //         account: address,
  //         args: [referrer!],
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }

  const buyTier1 = async (nonce: number): Promise<boolean | undefined> => {
    if (!walletClient || !address) {
      console.error("Wallet not connected");
      return;
    }
    console.log("buyTier1");
    console.log("SALE_ADDRESS:", SALE_ADDRESS);
    console.log("functionName:", "buyTier1");
    console.log("account:", address);
    const res = await waitForTransactionReceipt(
      await walletClient.writeContract({
        address: SALE_ADDRESS,
        abi: SALE_ABI,
        functionName: "buyTier1",
        account: address,
        nonce,
        gas: 300_000n,
        gasPrice: 5_000_000_000n,
      })
    );
    if (!res) {
      try {
        await publicClient.simulateContract({
          address: SALE_ADDRESS,
          abi: SALE_ABI,
          functionName: "buyTier1",
          account: address,
        });
      } catch (e: any) {
        console.error("simulate revert reason:", e.shortMessage);
      }
    }

    return res;
  };

  const buyTier2 = async (nonce: number): Promise<boolean | undefined> => {
    if (!walletClient || !address) {
      console.error("Wallet not connected");
      return;
    }
    const res = await waitForTransactionReceipt(
      await walletClient.writeContract({
        address: SALE_ADDRESS,
        abi: SALE_ABI,
        functionName: "buyTier2",
        account: address,
        nonce,
        gas: 300_000n,
        gasPrice: 5_000_000_000n,
      })
    );

    if (!res) {
      try {
        await publicClient.simulateContract({
          address: SALE_ADDRESS,
          abi: SALE_ABI,
          functionName: "buyTier2",
          account: address,
        });
      } catch (e: any) {
        console.error("simulate revert reason:", e.shortMessage);
        // toast.error(e.shortMessage);
      }
    }

    return res;
  };

  const bindAndBuyTier1 = async (
    referrer: Address,
    nonce: number
  ): Promise<boolean | undefined> => {
    if (!walletClient || !address) {
      console.error("Wallet not connected");
      return;
    }
    console.log("bindAndBuyTier1");
    console.log("SALE_ADDRESS:", SALE_ADDRESS);
    console.log("functionName:", "bindAndBuyTier1");
    console.log("account:", address);
    console.log("referrer:", referrer);
    const res = await waitForTransactionReceipt(
      await walletClient.writeContract({
        address: SALE_ADDRESS,
        abi: SALE_ABI,
        functionName: "bindAndBuyTier1",
        args: [referrer],
        account: address,
        nonce,
        gas: 300_000n,
        gasPrice: 5_000_000_000n,
      })
    );

    if (!res) {
      try {
        await publicClient.simulateContract({
          address: SALE_ADDRESS,
          abi: SALE_ABI,
          functionName: "bindAndBuyTier2",
          args: [referrer],
          account: address,
        });
      } catch (e: any) {
        console.error("simulate revert reason:", e.shortMessage);
        // toast.error(e.shortMessage);
      }
    }

    return res;
  };

  const bindAndBuyTier2 = async (
    referrer: Address,
    nonce: number
  ): Promise<boolean | undefined> => {
    if (!walletClient || !address) {
      console.error("Wallet not connected");
      return;
    }
    const res = await waitForTransactionReceipt(
      await walletClient.writeContract({
        address: SALE_ADDRESS,
        abi: SALE_ABI,
        functionName: "bindAndBuyTier2",
        args: [referrer],
        account: address,
        nonce,
        gas: 300_000n,
        gasPrice: 5_000_000_000n,
      })
    );

    if (!res) {
      try {
        await publicClient.simulateContract({
          address: SALE_ADDRESS,
          abi: SALE_ABI,
          functionName: "bindAndBuyTier2",
          args: [referrer],
          account: address,
        });
      } catch (e: any) {
        console.error("simulate revert reason:", e.shortMessage);
        // toast.error(e.shortMessage);
      }
    }

    return res;
  };

  const waitForTransactionReceipt = async (hash: Hash) => {
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("receipt:", receipt);

    return receipt.status === "success";
  };

  return { buyTier1, buyTier2, bindAndBuyTier1, bindAndBuyTier2 };
}
