import { Box, CssBaseline } from "@mui/material";
import React from "react";
import Header from "../Header";
import SideBar from "../SideBar";

interface Props {
  children?: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <CssBaseline />
      <Box display="flex" flexDirection="column" height="100vh">
        <Header />

        <Box display="flex" flex="1" flexDirection="row">
          <SideBar />
          {children}
          {/* <Box flex="1" p={2} overflow="auto">
            {children}
          </Box> */}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
