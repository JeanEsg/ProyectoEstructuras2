import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "/firebaseConfig";

const Formulario = () => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [formulario, setFormulario] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [auditorId, setAuditorId] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerAuditorId = async () => {
      if (!usuario?.email) return;
      const q = query(
        collection(db, "usuarios_internos"),
        where("usuario", "==", usuario.email.toLowerCase())
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setAuditorId(snapshot.docs[0].id);
      } else {
        setMensaje({
          tipo: "error",
          texto: "Auditor no encontrado en Firebase.",
        });
      }
    };
    obtenerAuditorId();
  }, [usuario]);

  const flattenPreguntas = (nodos) => {
    const todas = [];
    nodos?.forEach((seccion, indexSeccion) => {
      seccion.preguntas?.forEach((preg, indexPreg) => {
        todas.push({
          seccion: indexSeccion + 1,
          texto:
            typeof preg === "string"
              ? preg
              : typeof preg === "object"
                ? preg.input || preg.texto
                : String(preg),
        });
      });
    });
    return todas;
  };

  useEffect(() => {
    const obtenerFormulario = async () => {
      if (!id) return;
      setLoading(true);

      const q = query(collection(db, "formularios"), where("titulo", "==", id));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const formDoc = snapshot.docs[0];
        const datos = formDoc.data();
        setFormulario({ ...datos, _id: formDoc.id });

        const preguntasPlanas = flattenPreguntas(datos.nodos || []);
        setRespuestas(
          preguntasPlanas.map((p) => ({
            pregunta: p.texto,
            seccion: p.seccion,
            respuesta: "",
            evidencia: "",
          }))
        );
      } else {
        setMensaje({
          tipo: "error",
          texto: "Formulario no encontrado.",
        });
      }

      setLoading(false);
    };

    obtenerFormulario();
  }, [id]);

  const handleChange = (index, campo, valor) => {
    setRespuestas((prev) => {
      const nuevas = [...prev];
      nuevas[index] = { ...nuevas[index], [campo]: valor };
      return nuevas;
    });
  };

  const enviarRespuestas = async (e) => {
    e.preventDefault();

    if (respuestas.some((r) => !r.respuesta || !r.evidencia)) {
      setMensaje({
        tipo: "error",
        texto: "Complete todas las respuestas y evidencias.",
      });
      return;
    }

    if (!auditorId || !formulario?._id) {
      setMensaje({
        tipo: "error",
        texto: "Faltan datos del auditor o formulario.",
      });
      return;
    }

    try {
      await addDoc(collection(db, "respuestas"), {
        titulo: formulario?.titulo || "Formulario",
        respuestas,
        auditorInterno: auditorId,
        idFormulario: formulario._id,
        fecha: new Date().toISOString(),
      });

      setMensaje({
        tipo: "exito",
        texto: "Formulario enviado correctamente.",
      });
      setRespuestas([]);
    } catch (err) {
      console.error("Error al guardar en Firestore", err);
      setMensaje({
        tipo: "error",
        texto: "Error al guardar en Firestore.",
      });
    }
  };

  if (loading) return <div>Cargando formulario...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-xl font-bold text-center mb-4">{formulario?.titulo}</h1>

      {mensaje && (
        <div
          className={`mb-4 p-3 rounded text-white ${mensaje.tipo === "error" ? "bg-red-500" : "bg-green-500"
            }`}
        >
          {mensaje.texto}
          {mensaje.tipo === "exito" && (
            <div className="mt-2 text-center">
              <button
                className="bg-white text-green-600 px-4 py-1 rounded"
                onClick={() => navigate("/reports")}
              >
                Ver Reporte
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={enviarRespuestas} className="space-y-4">
        {respuestas.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <label className="block font-semibold mb-2">
              Sección {item.seccion} - {i + 1}. {item.pregunta}
            </label>
            <select
              className="w-full border p-2 rounded"
              value={item.respuesta}
              onChange={(e) => handleChange(i, "respuesta", e.target.value)}
              required
            >
              <option value="">Seleccione</option>
              <option value="Cumple">Cumple</option>
              <option value="No cumple">No cumple</option>
              <option value="Medianamente cumple">Medianamente cumple</option>
            </select>
            <input
              type="url"
              className="w-full border p-2 mt-2 rounded"
              placeholder="URL de evidencia"
              value={item.evidencia}
              onChange={(e) => handleChange(i, "evidencia", e.target.value)}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Enviar Formulario
        </button>
      </form>
    </div>
  );
};

export default Formulario;
