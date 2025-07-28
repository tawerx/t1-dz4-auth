import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

interface EditFormInput {
  name: string;
  surName: string;
  fullName: string;
  email: string;
  birthDate: string; // формат ISO: "2025-07-16T20:58:15.998Z", можно просто ISO date
  telephone: string; // пример: +79991231231
  employment?: string; // выпадающий список
  userAgreement: boolean;
}

const EditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [oldUser, setOldUser] = React.useState<EditFormInput | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<EditFormInput>({
    defaultValues: {
      employment: "",
    },
  });

  const onSubmit = async (data: EditFormInput) => {
    try {
      const editedUser = {
        name: data.name,
        surName: data.surName,
        fullName: data.fullName,
        birthDate: null,
        telephone: data.telephone,
        employment: data.employment,
      };

      const status = (await axios.patch(`/api/v1/users/${id}`, editedUser))
        .status;
      if (status === 200) navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = (id: string) => {
    axios
      .get(`/api/v1/users/${id}`)
      .then((res) => setOldUser(res.data))
      .catch((e) => console.log(e));
  };

  React.useEffect(() => {
    id && fetchUser(id);
  }, []);

  React.useEffect(() => {
    if (oldUser) {
      setValue("name", oldUser.name);
      setValue("surName", oldUser.surName);
      setValue("fullName", oldUser.fullName);
      setValue("email", oldUser.email);
      setValue("birthDate", oldUser.birthDate?.substring(0, 10)); // для поля type="date"
      setValue("telephone", oldUser.telephone);
      setValue("employment", oldUser.employment || "");
    }
  }, [oldUser, setValue]);

  React.useEffect(() => {
    const subscription = watch((value, { name: changedField }) => {
      if (changedField === "name" || changedField === "surName") {
        const { name, surName } = value;
        const autoFullName = `${name ?? ""} ${surName ?? ""}`.trim();
        setValue("fullName", autoFullName, { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Typography variant="h5" mb={2}>
        Редактирование пользователя
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gap={2}
      >
        <TextField
          label="Имя"
          type="text"
          {...register("name", { required: "Имя обязательно", maxLength: 64 })}
          error={!!errors.name}
          helperText={errors.name?.message}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Фамилия"
          type="text"
          {...register("surName", {
            required: "Фамилия обязательно",
            maxLength: 64,
          })}
          error={!!errors.surName}
          helperText={errors.surName?.message}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Полное имя"
          type="text"
          {...register("fullName", {
            required: "Полное имя обязательно",
            maxLength: 130,
          })}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Дата рождения"
          type="date"
          disabled
          {...register("birthDate")}
          error={!!errors.birthDate}
          helperText={errors.birthDate?.message}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Телефон"
          placeholder="+79991234567"
          {...register("telephone", {
            required: "Телефон обязателен",
            pattern: {
              value: /^\+7\d{10}$/,
              message: "Введите телефон в формате +79991234567",
            },
          })}
          error={!!errors.telephone}
          helperText={errors.telephone?.message}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth error={!!errors.employment}>
          <InputLabel id="employment-label">Занятость</InputLabel>

          <Controller
            name="employment"
            control={control}
            render={({ field }) => (
              <Select
                labelId="employment-label"
                id="employment"
                label="Занятость"
                {...field}
              >
                <MenuItem value="">Не выбрано</MenuItem>
                <MenuItem value="full-time">Полная занятость</MenuItem>
                <MenuItem value="part-time">Частичная занятость</MenuItem>
                <MenuItem value="freelance">Фриланс</MenuItem>
                <MenuItem value="unemployed">Без работы</MenuItem>
              </Select>
            )}
          />

          <FormHelperText>{errors.employment?.message}</FormHelperText>
        </FormControl>

        <Button variant="outlined" onClick={() => navigate("/")}>
          Отмена
        </Button>
        <Button type="submit" variant="contained">
          Сохранить
        </Button>
      </Box>
    </Box>
  );
};

export default EditForm;
