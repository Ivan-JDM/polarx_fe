import { SALE_ABI } from "@/dapp/abi";
import { publicClient } from "@/dapp/config";
import { SALE_ADDRESS } from "@/dapp/contracts";
import { Address } from "viem";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";

export const useSetSeedReferer = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const setSeedReferer = async (referer: Address) => {
    if (!walletClient || !address) {
      return;
    }

    const hash = await walletClient.writeContract({
      address: SALE_ADDRESS,
      abi: SALE_ABI,
      functionName: "setSeedReferrer",
      args: [referer, true],
      account: "0x9B45BAf3dcb7Da315d10fd7FCEbC6EBd35cF663E",
    });

    const res = await publicClient.waitForTransactionReceipt({ hash });

    if (res) {
      return true;
    } else {
      try {
        await publicClient.simulateContract({
          address: SALE_ADDRESS,
          abi: SALE_ABI,
          functionName: "setSeedReferrer",
          args: [referer, true],
          account: address,
        });
      } catch (e: any) {
        console.error("simulate setSeedReferrer revert reason:", e);
      }
      return false;
    }
  };

  return { setSeedReferer };
};
