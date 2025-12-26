import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import "./styles/index.css";
import { RoutePath } from "./constants";
import { Toaster } from "react-hot-toast";
import VConsole from "vconsole";
// import { WagmiProvider } from "wagmi";
// import { wagmiConfig } from "./dapp/config";
// import GlobalProvider from "./stores/global/provider";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "./queryClient";

new VConsole();

const App: React.FC = () => {
  // const Wrap = (Comp: React.FC) => {
  //   return (
  //     <GlobalProvider>
  //       <WagmiProvider config={wagmiConfig}>
  //         <QueryClientProvider client={queryClient}>
  //           <Comp />
  //         </QueryClientProvider>
  //       </WagmiProvider>
  //     </GlobalProvider>
  //   );
  // };
  return (
    <div className="flex flex-col h-full">
      <Routes>
        <Route path={RoutePath.HOME} element={<Home />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
          },
        }}
      />
    </div>
  );
};

export default App;
