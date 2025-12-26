import { useAccount, useWriteContract } from "wagmi";
import { ERC20_ABI } from "../dapp/erc20_abi";
import { USDT_ADDRESS, SALE_ADDRESS } from "../dapp/contracts";
import toast from "react-hot-toast";
import { WriteContractData } from "wagmi/query";
import { publicClient } from "@/dapp/config";

export function useApproveUsdt() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const approve = async (
    amount: bigint
  ): Promise<WriteContractData | undefined> => {
    if (!address) {
      console.error("Wallet not connected");
      toast.error("钱包未连接");
      return;
    }
    return writeContractAsync({
      address: USDT_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [SALE_ADDRESS, amount],
      account: address,
    });
  };

  const getAllowance = async (): Promise<bigint | undefined> => {
    if (!address) {
      console.error("Wallet not connected");
      toast.error("钱包未连接");
      return;
    }
    const onChainAllowance = await publicClient.readContract({
      address: USDT_ADDRESS,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [address, SALE_ADDRESS],
    });

    return onChainAllowance;
  };

  return { approve, getAllowance };
}
