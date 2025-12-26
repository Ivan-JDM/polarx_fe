import EN from "./en";
import ZH from "./zh-TW";

export default function i18n(lang: "en" | "zh-TW", text: string): string {
  const dict = lang === "en" ? EN : ZH;
  if (Object.prototype.hasOwnProperty.call(dict, text)) {
    // @ts-expect-error: Indexing by arbitrary string is checked above
    return dict[text];
  }
  throw new Error("i18n not found: " + text);
}
