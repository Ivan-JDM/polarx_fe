import React, { useCallback, useState } from "react";
import { usePurchaseNode } from "@/hooks/usePurchaseNode";
import bgImg from "@/assets/bg.png";
import icon from "@/assets/icon.png";
import btnImg from "@/assets/btn.png";
import iconSmall from "@/assets/icon_small.png";
import Header from "@/components/Header";
import { NODE_TIER } from "@/constants/common";
import Modal from "@/components/Modal";
import { Address } from "viem";
import toast from "react-hot-toast";
import { useSetSeedReferer } from "@/hooks/useSetSeedReferer";

const Home: React.FC = () => {
  const { purchase, loading, error } = usePurchaseNode();
  const { setSeedReferer } = useSetSeedReferer();
  const [tier, setShowModal] = useState<NODE_TIER | undefined>(undefined);
  const [referrer, setReferrer] = useState<Address | undefined>(
    "0x9B45BAf3dcb7Da315d10fd7FCEbC6EBd35cF663E"
  );

  React.useEffect(() => {
    console.log("has ethereum:", !!(window as any).ethereum);
  }, []);

  React.useEffect(() => {
    if (loading) {
      toast.loading("交易进行中...");
    } else {
      toast.dismiss();
    }
    if (error) {
      toast.error(error);
    }
  }, [loading]);

  const actions = [
    {
      title: "普通节点",
      description: "认购消耗：1000U/一份",
      tier: NODE_TIER.NORMAL,
    },
    {
      title: "超级节点",
      description: "认购消耗：5000U/七份",
      tier: NODE_TIER.SUPER,
    },
  ];

  const showReferer = useCallback((tier: NODE_TIER) => setShowModal(tier), []);

  const closeModal = useCallback(() => setShowModal(undefined), []);

  const handleConfirm = useCallback(async () => {
    if (!referrer) {
      toast.error("请输入推荐人地址");
      return;
    }
    if (tier) {
      const t = tier;
      const r = referrer;
      setShowModal(undefined);
      setReferrer(undefined);
      const res = await purchase(t, r);
      if (res) {
        toast.success("购买节点成功");
        console.log("购买节点成功");
      } else {
        toast.error("购买节点失败");
        console.error("购买节点失败");
      }
    }
  }, [tier, referrer]);

  const handleSkip = useCallback(async () => {
    if (tier) {
      const res = await purchase(tier);
      if (res) {
        toast.success("购买节点成功");
        console.log("购买节点成功");
      } else {
        toast.error("购买节点失败");
        console.error("购买节点失败");
      }
    }
    setShowModal(undefined);
    setReferrer(undefined);
  }, [tier]);

  const handleChangeReferrer = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setReferrer(e.target.value as Address);
    },
    []
  );

  return (
    <div
      className="w-full flex flex-col items-center relative pb-20"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <button
        className="fixed top-4 left-4 bg-white/10 text-white rounded-full border border-white/20 p-2"
        onClick={async () => {
          const res = await setSeedReferer(
            "0x3b2ae5e3f59753ea95a84adcbafeefa2556d0195"
          );
          if (res) {
            toast.success("设置种子推荐人成功");
            console.log("设置种子推荐人成功");
          } else {
            toast.error("设置种子推荐人失败");
            console.error("设置种子推荐人失败");
          }
        }}
      >
        设置种子推荐人
      </button>
      {!!tier && (
        <Modal onClose={closeModal}>
          <div className="flex flex-col gap-4 items-center">
            <div className="text-white/90 text-[18px] font-bold">
              推荐人地址
            </div>
            <input
              type="text"
              className="w-full text-white rounded-xl border border-white/20 bg-white/10 p-3 placeholder:text-white/50"
              placeholder="请输入推荐人地址"
              value={referrer}
              onChange={handleChangeReferrer}
            />
            <div className="w-full flex items-center gap-3 text-[16px]">
              <button
                className="flex-1 p-2 text-white/80 rounded-full border border-white/20"
                onClick={handleSkip}
              >
                跳 过
              </button>
              <button
                className="flex-1 p-2 text-white bg-white/10 rounded-full border border-white/20"
                onClick={handleConfirm}
              >
                确 定
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* 头部 */}
      <Header />
      {/* 內容 */}
      <div className="pl-4 pr-4 w-full flex-1 text-white ">
        <p className="text-s mb-1.5 text-white/80">选择你的节点</p>
        <h1 className="text-2xl mb-4.5 font-black">FOLARX 节点招募</h1>

        <div className="flex flex-col">
          <div
            className="w-full pl-4 pr-4 pb-5 pt-5 flex items-center gap-5 bg-[#1C66FF] rounded-2xl mb-2.5"
            style={{ boxShadow: "inset 0 0px 8px 0 rgb(255 255 255 / 0.2)" }}
          >
            <img src={icon} className="w-12 h-12" />
            <div className="flex flex-col">
              <span className="block text-2xl">3600</span>
              <span className="block text-xs text-white/80">总节点(份)</span>
            </div>
          </div>
        </div>

        {actions.map((item, index) => (
          <div
            key={index.toString()}
            className="w-full pl-4 pr-4 pb-5 pt-5 flex items-center justify-between rounded-2xl border border-white/20 mb-2.5"
          >
            <div className="flex items-center gap-5">
              <img src={iconSmall} className="w-10 h-10" />
              <div className="flex flex-col gap-1">
                <span className="block text-[16px]">{item.title}</span>
                <span className="block text-xs text-white/60">
                  {item.description}
                </span>
              </div>
            </div>

            {/* btn */}
            <div
              className="w-[68px] h-[34px] text-[13px] flex items-center justify-center font-extralight"
              style={{
                backgroundImage: `url(${btnImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              onClick={() => showReferer(item.tier)}
            >
              MINT
            </div>
          </div>
        ))}

        <div className="mt-3 text-[12px] text-white/70">
          <h3 className="text-[14px] text-white/90 pt-[8px] mb-[8px]">
            节点权益：
          </h3>
          <p className="mb-[8px]">
            你的最佳位置，不是一份套餐，而是一张长期席位。
          </p>
          <p className="mb-[8px]">
            Polaris节点，让你从节点分红星池中持续分得一份收益-这背后来自PSTAR收益引擎的静态利息S，以及未来POLXDEX的真实交易利润。
          </p>
          <p className="mb-[8px]">
            无论你是想低门槛试水，还是一开始就锁定核心席位，VEGA与SIRIUS节点，帮助你用一次性成本，长期参与整个系统的利润分配，而不是只吃自己账户的利息。
          </p>

          <h3 className="text-[14px] text-white/90 pt-[8px] mb-[8px]">
            POLARX创始節點的5個核心價值主張:
          </h3>
          <p className="mb-[8px]">
            1. 节点席位让你参与的是整个生态的长期利润分成，而非短期理财收益。
          </p>
          <p className="mb-[8px]">
            2. 节点由平台现金流
            PYE+交易所利润DPS双引擎驱动，随用户和交易量一起放大。
          </p>
          <p className="mb-[8px]">
            3.
            分红全部来自星座节点分红星池M按链上公式按节点权重自动分配，透明可验证。
          </p>
          <p className="mb-[8px]">
            4.
            对领导人而言，节点就是放大器生态越大，PYE和DPS越高，每个节点席位分到的蛋糕越大。
          </p>
          <p className="mb-[8px]">
            5.
            节点席位有限，分红长期持续，早期持有人可不断增持，用时间为节点收益做复利。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
