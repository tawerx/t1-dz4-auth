import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();

  const onClickCreateUser = () => {
    navigate("/user/create");
  };

  return (
    <Box
      width="300px"
      bgcolor="grey.200"
      overflow="auto"
      borderRight="1px solid black"
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={2}
    >
      <Button variant="outlined" onClick={onClickCreateUser}>
        Создать пользователя
      </Button>
    </Box>
  );
};

export default SideBar;
