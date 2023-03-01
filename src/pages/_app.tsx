import "@/styles/index.scss";
import { createTheme, PaletteMode } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import axios from "axios";
import type { AppProps } from "next/app";
import React, { createContext, useCallback, useEffect, useState } from "react";
import Header from "../components/header";
import { getTheme } from "../hooks/useThem";
import Page from "../components/page";
import { API_URL } from "@/utils/config";
import ReactGA from "react-ga";
import { useRouter } from "next/router";

ReactGA.initialize("UA-257495971-2");
export const GlobalContext = createContext<any>(null);
export default function App({ Component, pageProps }: AppProps) {
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [mode, setMode] = useState<PaletteMode>("dark");

  const { asPath } = useRouter();

  const theme = React.useMemo(() => createTheme(getTheme(mode)), [mode]);
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  const verifyUser = useCallback(async () => {
    const { data } = await axios.post(
      `${API_URL}/api/users/token/refresh`,
      null,
      {
        withCredentials: true,
      }
    );
    if (data && data.token) {
      setLoginToken(data.token);
      const { data: profile } = await axios.post(
        "http://localhost:5000/api/users/details",
        null,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      ReactGA.ga("create", {
        trackingId: "UA-257495971-2",
        cookiDomain: "auto",
        userId: profile?.id,
        email: profile?.email,
      });
    } else {
      setLoginToken(null);
    }
    setTimeout(verifyUser, 5 * 60 * 1000);
  }, [setLoginToken]);

  // useEffect(() => {
  //   setMode(prefersDarkMode ? "dark" : "light");
  // }, [prefersDarkMode]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  useEffect(() => {
    console.log({asPath});
    ReactGA.pageview(asPath);
    ReactGA.plugin.require("localHitSender", { path: asPath, debug: true });
  }, [asPath]);

  return (
    <GlobalContext.Provider
      value={{
        colorMode,
        mode,
        loginToken,
        setLoginToken,
      }}
    >
      <ThemeProvider theme={theme}>
        <Header />
        <Page>
          <Component {...pageProps} />
        </Page>
      </ThemeProvider>
    </GlobalContext.Provider>
  );
}
