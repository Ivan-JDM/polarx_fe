import { createContext, Dispatch } from "react";

export interface IGlobalCtx {
  lang: "en" | "zh-TW" | "zh-CN";
  setLang: Dispatch<React.SetStateAction<"en" | "zh-TW" | "zh-CN">>;
}

const GlobalContext = createContext<IGlobalCtx>({
  lang: "zh-CN",
  setLang: () => {},
});

export default GlobalContext;
