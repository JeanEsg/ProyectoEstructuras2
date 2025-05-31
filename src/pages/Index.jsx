import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  UserCog,
  FileText,
  SearchCheck,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  BarChart2,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { usuario } = useAuth();
  const rol = usuario?.rol;
  const [usuarioNombre, setUsuarioNombre] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!usuario) return null;

  const roleColors = {
    admin: "from-sky-800 to-sky-950",
    auditor_interno: "from-cyan-600 to-cyan-900",
    auditor_externo: "from-sky-700 to-sky-950",
  };

  const iconMap = {
    admin: <UserCog size={48} className="text-white" />,
    auditor_interno: <SearchCheck size={48} className="text-white" />,
    auditor_externo: <FileText size={48} className="text-white" />,
  };

  const featureIcons = {
    usuarios: <UserCog size={32} className="text-white" />,
    reportes: <BarChart2 size={32} className="text-white" />,
    crearForm: <ClipboardList size={32} className="text-white" />,
    eliminarForm: <ShieldCheck size={32} className="text-white" />,
    perfil: <UserCog size={32} className="text-white" />,
    formularios: <PlusCircle size={32} className="text-white" />,
    planes: <ClipboardList size={32} className="text-white" />,
    comentarios: <LayoutDashboard size={32} className="text-white" />,
    pendientes: <FileText size={32} className="text-white" />,
    evaluacion: <ClipboardList size={32} className="text-white" />,
    estado: <BarChart2 size={32} className="text-white" />,
    seguimiento: <PlusCircle size={32} className="text-white" />,
  };

  const featureRoutes = {
    usuarios: "/usuarios",
    crearForm: "/crear-form",
    eliminarForm: "/forms",
    formularios: "/forms",
    planes: "/plan-action",
    comentarios: "/plan-action",
    pendientes: "/PlanesExterno",
    evaluacion: "/PlanesExterno",
    estado: "/PlanesExterno",
    seguimiento: "/PlanesExterno",
  };

  const current = t(`index.${rol}`, { returnObjects: true });

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const docRef = doc(db, "usuarios", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datosUsuario = docSnap.data();
          setUsuarioNombre(datosUsuario.name);
        } else {
          console.log("No se encontró el documento del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    obtenerDatosUsuario();
  }, [usuario.uid]);

  return (
    <div className="mt-2 max-w-5xl mx-auto">
      <div
        className={`rounded-3xl shadow-lg text-white p-7 mb-8 flex items-center gap-6 bg-gradient-to-r ${roleColors[rol]}`}
      >
        {iconMap[rol]}
        <div>
          <h1 className="text-3xl font-bold">
            {t("index.welcome")}, {usuarioNombre}{" "}
            <span className="ml-2">👋</span>
          </h1>
          <p className="text-lg mt-2">
            {t("index.role")}:{" "}
            <span className="font-semibold capitalize">{current.title}</span>
          </p>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-xl shadow p- space-y-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          {t("index.resume")}
        </h2>
        <p className="text-gray-700 text-lg">{current.description}</p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {current.list.map((item, idx) => (
            <li key={idx} className="text-md">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {t("index.actions")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(current.features).map(([key, { title, desc }], idx) => {
          const featureColors = {
            usuarios: "from-blue-600 to-blue-700",
            reportes: "from-indigo-600 to-indigo-700",
            crearForm: "from-cyan-600 to-cyan-700",
            eliminarForm: "from-sky-700 to-sky-800",
            perfil: "from-cyan-600 to-cyan-700",
            formularios: "from-blue-600 to-blue-700",
            planes: "from-sky-600 to-sky-700",
            comentarios: "from-cyan-900 to-cyan-800",
            pendientes: "from-sky-700 to-sky-800",
            evaluacion: "from-indigo-700 to-indigo-800",
            estado: "from-blue-700 to-blue-800",
            seguimiento: "from-cyan-800 to-cyan-900",
          };

          return (
            <div
              key={idx}
              onClick={() => featureRoutes[key] && navigate(featureRoutes[key])}
              className={`p-4 rounded-xl shadow-lg text-white flex flex-col hover:scale-105 transition-transform duration-300 cursor-pointer bg-gradient-to-br ${featureColors[key] || "from-gray-500 to-gray-700"
                }`}
            >
              <div className="mb-4">{featureIcons[key]}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm">{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
