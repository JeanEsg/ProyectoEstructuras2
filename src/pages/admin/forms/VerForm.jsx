import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const VerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const obtenerFormulario = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "formularios"));
        let formularioEncontrado = null;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.titulo === id) {
            formularioEncontrado = data;
          }
        });

        if (!formularioEncontrado) {
          setMensaje({
            tipo: "error",
            texto: "Formulario no encontrado.",
          });
        } else {
          setFormulario(formularioEncontrado);
        }
      } catch (error) {
        console.error("Error al cargar el formulario:", error);
        setMensaje({
          tipo: "error",
          texto: "Error al cargar el formulario. Intenta nuevamente.",
        });
      }
    };

    if (id) obtenerFormulario();
  }, [id]);

  if (!formulario) {
    return (
      <div className="text-center mt-10 text-gray-600">
        {mensaje ? mensaje.texto : "Cargando formulario..."}
      </div>
    );
  }

  const obtenerTexto = (dato) => {
    if (typeof dato === "string") return dato;
    if (dato?.texto) return dato.texto;
    if (dato?.input) return dato.input;
    return JSON.stringify(dato);
  };

  return (
    <div className="p-6 mt-8 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl shadow-inner p-8 max-h-[80vh] overflow-y-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-sky-900">
          📝 {formulario.titulo || "Formulario sin título"}
        </h1>

        {formulario.nodos?.map((seccion, i) => (
          <div
            key={i}
            className="bg-white border-l-4 border-sky-500 rounded-lg shadow p-6 space-y-3"
          >
            <h2 className="text-xl font-semibold text-sky-800">
              Sección {i + 1}: {obtenerTexto(seccion.pregunta)}
            </h2>

            {seccion.preguntas?.length > 0 ? (
              <ul className="list-decimal list-inside text-gray-800 space-y-1 ml-2">
                {seccion.preguntas.map((preg, j) => (
                  <li key={j}>{obtenerTexto(preg)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No hay preguntas en esta sección.
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-[#2067af] to-blue-950 hover:from-[#1b5186] hover:to-blue-900 text-white font-medium px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerForm;
