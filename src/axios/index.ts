import axios from "axios";

const instance = axios.create({
  baseURL: "https://genuine-nourishment-production.up.railway.app", // подставь актуальный URL
  withCredentials: true, // ВАЖНО: позволяет отправлять куки
});

export default instance;
