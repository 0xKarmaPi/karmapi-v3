import { Icon } from "@iconify/react";
import { Box, Button, Stack, Typography } from "@mui/material";
import "./App.css";
import { useEffect } from "react";
import classnames from "classnames";
import Deploy from "./page/deploy";
import { ConnectButton } from "@mysten/dapp-kit";
import useHandBook from "./hooks/useHandBook";
import RegisterModal from "./components/RegisterModal";
import Prediction from "./page/prediction";
import Detail from "./page/detail";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

function App() {
  useEffect(() => {
    // enqueueSnackbar("That was easy!", { variant: "success" });
    // enqueueSnackbar("That was easy!", { variant: "error" });
    // enqueueSnackbar("That was easy!", { variant: "warning" });
    // enqueueSnackbar("That was easy!", { variant: "info" });
  }, []);

  const { handBook, isHandBookFetched } = useHandBook();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack justifyContent="space-between">
      {/* <BackgroundSVG /> */}
      {/* Nav */}
      <Stack
        className="h-16 w-full"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mt: "-1rem",
        }}
      >
        <Box className="w-40 flex items-start">
          <img src="./logo.png" width={36} alt="" />
        </Box>
        <Stack direction="row" spacing={6} className="text-lg">
          <Box
            className={classnames("cursor-pointer", {
              "font-black":
                location.pathname === "/prediction" ||
                location.pathname === "/",
            })}
            onClick={() => {
              navigate("/prediction");
            }}
          >
            Prediction Event
          </Box>
          <Box
            className={classnames("cursor-pointer", {
              "font-black": location.pathname === "/deploy",
            })}
            onClick={() => {
              navigate("/deploy");
            }}
          >
            Deploy
          </Box>
        </Stack>
        <Box className="w-40 flex items-end">
          <ConnectButton />
        </Box>
      </Stack>
      <Stack
        alignItems="center"
        justifyContent="center"
        className="mt-8"
        sx={{
          zIndex: 0,
          // height: "calc(100vh - 128px - 4rem)",
        }}
      >
        <Routes>
          <Route
            path={"/"}
            element={
              isHandBookFetched && !handBook ? (
                <RegisterModal />
              ) : (
                <Prediction />
              )
            }
          ></Route>
          <Route
            path={"/prediction"}
            element={
              isHandBookFetched && !handBook ? (
                <RegisterModal />
              ) : (
                <Prediction />
              )
            }
          ></Route>
          <Route path={"/detail/:id"} element={<Detail />}></Route>
          <Route
            path={"/deploy"}
            element={
              isHandBookFetched && !handBook ? <RegisterModal /> : <Deploy />
            }
          ></Route>
        </Routes>
        {/* <Prediction /> */}
        {/* <Detail /> */}
        {/* RegisterModal */}
        {/* {isHandBookFetched && !handBook ? <RegisterModal /> : <Deploy />} */}
        {/* <Dashboard /> */}
      </Stack>
      {/* Footer */}
      {/* <CommonModal /> */}
    </Stack>
  );
}

export default App;
