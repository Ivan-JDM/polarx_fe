export function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isWalletInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();

  return (
    ua.includes("tokenpocket") ||
    ua.includes("metamask") ||
    ua.includes("okx") ||
    ua.includes("bitkeep") || // Bitget
    ua.includes("bitget") ||
    ua.includes("trust") ||
    ua.includes("imtoken") ||
    ua.includes("mathwallet") ||
    ua.includes("onekey") ||
    ua.includes("safepal") ||
    ua.includes("phantom")
  );
}

export function hasInjectedProvider(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (window as any).ethereum !== "undefined"
  );
}

export function shouldUseInjected(): boolean {
  return isWalletInAppBrowser() && hasInjectedProvider();
}
