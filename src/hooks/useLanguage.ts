import i18n from "@/i18n";
import GlobalContext from "@/stores/global/context";
import { useContext } from "react";

export default function useLanguage() {
  const { lang } = useContext(GlobalContext);
  return (target: string) => i18n(lang, target);
}
