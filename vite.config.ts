import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";

export default defineConfig(({ mode }) => {
  dotenv.config({ path: `.env.${mode}` });

  const env = loadEnv(mode, process.cwd(), "");

  console.log("当前环境变量：", env.VITE_API_BASE_URL);

  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
    },
    server: {
      // https: {
      //   key: fs.readFileSync("./localhost+1-key.pem"),
      //   cert: fs.readFileSync("./localhost+1.pem"),
      // },
      host: "0.0.0.0", // 允许外部访问
      port: 5173, // 端口
      open: true, // 自动打开浏览器
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "dudley-tympanic-anitra.ngrok-free.dev",
      ],
    },
    build: {
      target: "es2020",
    },
  };
});
