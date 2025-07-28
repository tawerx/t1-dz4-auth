import { Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useStore } from "../../zustand/store";
import React from "react";
import axios from "../../axios";

interface fetchUser {
  name: string;
  id: string;
  surName: string;
  fullName: string;
  email: string;
}

const Header = () => {
  const [userInfo, setUserInfo] = React.useState<fetchUser | null>(null);
  const setUser = useStore((state) => state.setUser);
  const onClickLogout = async () => {
    try {
      const status = (await axios.post("/api/v1/auth/logout")).status;
      if (status === 201) {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = () => {
    axios
      .get("/api/v1/users/1")
      .then((res) => setUserInfo(res.data))
      .catch(() => setUserInfo(null));
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Box
      borderBottom="1px solid black"
      padding={1}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      bgcolor="grey.200"
    >
      <Typography variant="h5">Панель управления пользователями</Typography>
      <Box display="flex" flexDirection="row" gap={2}>
        <Typography variant="h6">{userInfo && userInfo.name}</Typography>

        <IconButton onClick={onClickLogout}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
