import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import React from "react";
import { useStore } from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../axios";

const employmentLabels: Record<string, string> = {
  "full-time": "Полная занятость",
  "part-time": "Частичная занятость",
  freelance: "Фриланс",
  unemployed: "Без работы",
};

const UsersTable = () => {
  const users = useStore((state) => state.users);
  const setUsers = useStore((state) => state.setUsers);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("/api/v1/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Удалить пользователя?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/v1/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/user/edit/${id}`);
  };

  return (
    <TableContainer component={Paper} sx={{ padding: "15px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell>Фамилия</TableCell>
            <TableCell>Полное имя</TableCell>
            <TableCell>Дата рождения</TableCell>
            <TableCell>Телефон</TableCell>
            <TableCell>Занятость</TableCell>
            <TableCell align="center">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.surName}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>
                {user.birthDate
                  ? new Date(user.birthDate).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell>{user.telephone || "—"}</TableCell>
              <TableCell>
                {user.employment ? employmentLabels[user.employment] : "—"}
              </TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => handleEdit(user.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
