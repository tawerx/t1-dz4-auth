import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import UsersTable from "./components/UsersTable";
import RegisterForm from "./components/RegisterForm";
import EditForm from "./components/EditForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <UsersTable />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/user/create"
          element={
            <ProtectedRoute>
              <Layout>
                <RegisterForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditForm />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
