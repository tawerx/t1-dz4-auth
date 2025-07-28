import React from "react";
import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../../zustand/store";
import axios from "../../axios";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios
      .get("/api/v1/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
