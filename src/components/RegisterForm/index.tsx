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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";

interface RegisterFormInputs {
  name: string;
  surName: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  email: string;
  birthDate: string; // формат ISO: "2025-07-16T20:58:15.998Z", можно просто ISO date
  telephone: string; // пример: +79991231231
  employment?: string; // выпадающий список
  userAgreement: boolean;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      userAgreement: false,
      employment: "",
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const newUser = {
        name: data.name,
        surName: data.surName,
        fullName: data.fullName,
        password: data.password,
        email: data.email,
        birthDate: data.birthDate && new Date(data.birthDate).toISOString(),
        telephone: data.telephone,
        employment: data.employment,
        userAgreement: data.userAgreement,
      };
      console.log(newUser);
      const status = (await axios.post("/api/v1/users", newUser)).status;
      if (status === 201) navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

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
        Создание пользователя
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
        />

        <TextField
          label="Пароль"
          type="password"
          {...register("password", {
            required: "Пароль обязателен",
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          label="Подтверждение пароля"
          type="password"
          {...register("confirmPassword", {
            required: "Подтвердите пароль",
            validate: (val) =>
              val === getValues("password") || "Пароли не совпадают",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
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
          label="Email"
          type="email"
          {...register("email", {
            required: "Email обязателен",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Некорректный email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          // label="Дата рождения"
          type="date"
          {...register("birthDate", { required: "Дата рождения обязательна" })}
          error={!!errors.birthDate}
          helperText={errors.birthDate?.message}
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

        <Controller
          name="userAgreement"
          control={control}
          rules={{
            validate: (value) => value || "Вы должны принять соглашение",
          }}
          render={({ field }) => (
            <>
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Я принимаю пользовательское соглашение"
              />
              {errors.userAgreement && (
                <FormHelperText error>
                  {errors.userAgreement.message}
                </FormHelperText>
              )}
            </>
          )}
        />

        <Button variant="outlined" onClick={() => navigate("/")}>
          Отмена
        </Button>
        <Button type="submit" variant="contained">
          Создать пользователя
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterForm;
