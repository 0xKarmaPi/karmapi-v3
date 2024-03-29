import ThemeProvider from "@/theme/index.tsx";
import { SnackbarProvider } from "notistack";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MaterialDesignContent } from "notistack";
import { styled } from "@mui/material";
import { common } from "./theme/palette.ts";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import "@mysten/dapp-kit/dist/index.css";
import { BrowserRouter } from "react-router-dom";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl("mainnet") },
});
const queryClient = new QueryClient();

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent": {
    color: common.black,
    borderRadius: "12px",
    boxShadow: "0px 10px 32px 0px rgba(38, 38, 38, 0.08)",
  },
  "&.notistack-MuiContent-success": {
    backgroundColor: "#fff",
    svg: {
      color: "#23B896",
    },
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: "#fff",
    svg: {
      color: "#FF5A47",
    },
  },
  "&.notistack-MuiContent-warning": {
    backgroundColor: "#fff",
    svg: {
      color: "#15AD31",
    },
  },
  "&.notistack-MuiContent-info": {
    backgroundColor: "#fff",
    svg: {
      color: "#1B9AEE",
    },
  },
}));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          <BrowserRouter>
            <SnackbarProvider
              Components={{
                success: StyledMaterialDesignContent,
                error: StyledMaterialDesignContent,
                warning: StyledMaterialDesignContent,
                info: StyledMaterialDesignContent,
              }}
            />
            <App />
          </BrowserRouter>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
