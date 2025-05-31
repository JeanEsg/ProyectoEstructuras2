import { useAuth } from "../context/AuthContext";
import AudiInterno from "../pages/AudiInterno";
import Admin from "../pages/Admin";

const FormsRedirect = () => {
  const { usuario } = useAuth();

  if (!usuario) return null;

  if (usuario.rol === "admin") {
    return <Admin />;
  } else {
    return <AudiInterno />;
  }
};

export default FormsRedirect;