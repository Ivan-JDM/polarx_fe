import LanguageSelect from "../Select/language";
import useLanguage from "@/hooks/useLanguage";
import { useWallet } from "@/hooks/useWallet";
import logo from "@/assets/logo.png";
import avatar from "@/assets/avatar.png";
import expand from "@/assets/expand.png";
import { useMemo, useState } from "react";
import Modal from "../Modal";
import { CreateConnectorFn, Connector } from "wagmi";
import { isMobile, shouldUseInjected } from "@/utils/env";

const Header = () => {
  const lang = useLanguage();
  const isMobileEnv = isMobile();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const { address, isConnected, connect, connectors, disconnect } = useWallet();
  const shortAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  const onConnect = (connector: CreateConnectorFn | Connector) => {
    console.log("onConnect", connector);
    console.log("connector id:", (connector as Connector).id);
    if (!connector) return;

    try {
      connect({ connector });
    } catch (e) {
      console.error("connect error", e);
    }

    closeWalletModal();
  };

  const walletConnectConnector = useMemo(
    () => connectors.find((c) => c.id === "walletConnect"),
    [connectors]
  );

  const injectedWallets = useMemo(
    () => connectors.filter((c) => c.type === "injected"),
    [connectors]
  );

  const closeWalletModal = () => {
    setShowConnectModal(false);
  };

  const showWalletModal = () => {
    setShowConnectModal(true);
  };

  const showWalletDisconnectModal = () => {
    setShowDisconnectModal(true);
  };

  const closeWalletDisconnectModal = () => {
    setShowDisconnectModal(false);
  };

  const onDisconnect = () => {
    disconnect();
    closeWalletDisconnectModal();
  };

  return (
    <>
      {/* 选择连接方式 */}
      {connectors.length && showConnectModal && (
        <Modal onClose={closeWalletModal}>
          <div className="flex flex-col gap-4 items-center">
            <p className="text-[16px] font-bold text-white">
              {lang("pages.modal.connect_wallet_method")}
            </p>
            {/* 移动端：只允许 WalletConnect */}
            {isMobileEnv && walletConnectConnector && !shouldUseInjected() && (
              <div
                className="flex items-center bg-transparent justify-center border border-white/20 rounded-full px-8 py-2"
                onClick={() => onConnect(walletConnectConnector)}
              >
                Connect Wallet
              </div>
            )}

            {shouldUseInjected() &&
              isMobileEnv &&
              injectedWallets.length > 0 && (
                <div className="flex flex-col gap-2">
                  {injectedWallets.map((connector) => (
                    <div
                      key={connector.id}
                      className="flex items-center bg-transparent justify-center border border-white/20 rounded-full px-8 py-2"
                      onClick={() => onConnect(connector)}
                    >
                      {connector.name}
                    </div>
                  ))}
                </div>
              )}

            {/* 桌面端：浏览器插件钱包 */}
            {!isMobileEnv && !shouldUseInjected() && (
              <div className="flex flex-col gap-2">
                {injectedWallets.map((connector) => (
                  <div
                    key={connector.id}
                    className="flex items-center bg-transparent justify-center border border-white/20 rounded-full px-8 py-2"
                    onClick={() => onConnect(connector)}
                  >
                    {connector.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {showDisconnectModal && (
        <Modal onClose={closeWalletDisconnectModal}>
          <div className="flex flex-col gap-4 items-center">
            <p className="text-[16px] font-bold text-white">
              {lang("pages.modal.disconnect_wallet_confirm")}
            </p>
            <div
              className="flex items-center bg-transparent justify-center border border-white/20 rounded-full px-8 py-2"
              onClick={() => onDisconnect()}
            >
              Disconnect Wallet
            </div>
          </div>
        </Modal>
      )}

      <div className="pl-4 pr-4 pt-2 w-full flex items-center justify-between mb-10">
        <img src={logo} alt="logo" className="w-28 h-5" />
        <div className="flex items-center gap-1">
          <LanguageSelect />
          <div className="flex items-center gap-1">
            {isConnected ? (
              <div
                className="pl-[1px] pt-[1px] pb-[1px] pr-2 rounded-full text-white bg-transparent text-xs border border-white/20 flex items-center gap-1"
                onClick={showWalletDisconnectModal}
              >
                <img src={avatar} alt="icon" className="w-5 h-5" />
                {shortAddress}
                <img src={expand} alt="icon" className="w-2 h-2" />
              </div>
            ) : (
              <div
                className="px-3 py-1 rounded-full  text-white text-xs bg-transparent border border-white/20"
                onClick={showWalletModal}
              >
                {lang("pages.home.connect_wallet")}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
