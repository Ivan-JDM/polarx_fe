import GlobalContext from "@/stores/global/context";
import classNames from "classnames";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import intenational from "@/assets/intenational.png";
import { LANGUAGE } from "@/constants/common";

const options = [
  { value: "zh-TW", label: "繁體中文" },
  { value: "en", label: "English" },
];

export default function LanguageSelect({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useContext(GlobalContext);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    const res = localStorage.getItem("polarx_lang");
    res && setLang(res as LANGUAGE);

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (value: LANGUAGE) => {
    localStorage.setItem("polarx_lang", value);
    setLang(value);
    setOpen(false);
  };

  // 英语、繁体中文、西班牙语、日语、韩语
  const labels = [
    { key: LANGUAGE.EN, value: "English" },
    { key: LANGUAGE.ZH_TW, value: "繁体中文" },
    { key: LANGUAGE.ZH_CN, value: "简体中文" },
  ];

  return (
    <div ref={ref} className={`inline-block relative ${className} `}>
      <div
        onClick={() => setOpen(!open)}
        className={classNames(
          "flex items-center justify-between pl-2 pr-1 h-9"
        )}
      >
        <img src={intenational} alt="flag" className="w-4 h-4" />
      </div>

      {/* 下拉菜单 */}
      {open && (
        <div className="absolute px-4 py-3 left-0 border bg-white/10 border-white/20 rounded-xl z-999 backdrop-blur-sm flex flex-col gap-3">
          {labels.map((label) => (
            <div
              key={label.key}
              onClick={() => handleSelect(label.key)}
              className={`text-sm transition text-nowrap ${lang === label.key ? "text-white" : "text-white/60"}`}
            >
              {label.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
