import { useState } from "react";
import GlobalContext from "./context";

export default function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<"en" | "zh-TW">("en");
  return (
    <GlobalContext.Provider
      value={{
        lang,
        setLang,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
