import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "/firebaseConfig";
import { FcRules } from "react-icons/fc";
import { SiGoogleforms } from "react-icons/si";
import { useTranslation } from "react-i18next";

const AudiInterno = () => {
  const [formularios, setFormularios] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const obtenerFormularios = async () => {
      try {
        const q = query(collection(db, "formularios"), orderBy("creadoEn", "desc"));
        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormularios(lista);
      } catch (error) {
        console.error("Error al obtener formularios de Firebase:", error);
      }
    };

    obtenerFormularios();
  }, []);

  return (
    <div className="mx-auto py-8">
      <div className="bg-slate-200 mx-auto rounded-2xl shadow-sm flex-1 p-4 max-h-[80vh] max-w-[70vw] overflow-y-auto space-y-6">
        <h1 className="text-3xl text-gray-800 font-bold flex items-center justify-center mb-12">
          <SiGoogleforms className="text-primary mr-2" />
          {t("forms.title")}
        </h1>

        <div className="flex flex-wrap justify-center gap-6 w-full">
          {formularios.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-xl shadow-xl p-5 max-w-xs w-full min-h-[200px]
              cursor-pointer hover:scale-105 transition-transform duration-300 backdrop-blur-md border
              border-primary flex flex-col justify-center items-center"
              onClick={() => navigate(`/forms/${encodeURIComponent(form.titulo)}`)}
            >
              <FcRules className="text-7xl mb-4" />
              <h2 className="text-black font-semibold text-xl text-center mb-2 line-clamp-3">
                {form.titulo}
              </h2>
              <p className="text-sm text-gray-700 text-center line-clamp-3">
                {form.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudiInterno;
