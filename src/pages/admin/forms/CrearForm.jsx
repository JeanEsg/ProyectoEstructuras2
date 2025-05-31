import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "/firebaseConfig.js";

const CrearForm = () => {
  const [tituloFormulario, setTituloFormulario] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [nombreSeccion, setNombreSeccion] = useState("");
  const [preguntaActual, setPreguntaActual] = useState("");
  const [idSeccionSeleccionada, setIdSeccionSeleccionada] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const agregarSeccion = () => {
    if (!nombreSeccion.trim()) return;

    const nuevaSeccion = {
      id: uuidv4(),
      nombre: nombreSeccion.trim(),
      preguntas: [],
    };

    setSecciones([...secciones, nuevaSeccion]);
    setNombreSeccion("");
  };

  const agregarPregunta = () => {
    if (!preguntaActual.trim() || !idSeccionSeleccionada) return;

    setSecciones((prev) =>
      prev.map((s) =>
        s.id === idSeccionSeleccionada
          ? {
            ...s,
            preguntas: [...s.preguntas, { id: uuidv4(), texto: preguntaActual.trim() }],
          }
          : s
      )
    );

    setPreguntaActual("");
  };

  const guardarFormulario = async () => {
    if (!tituloFormulario.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Formulario sin título",
        text: "Debes agregar un título al formulario.",
      });
      return;
    }

    if (secciones.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Formulario vacío",
        text: "Debes agregar al menos una sección.",
      });
      return;
    }

    const conexiones = secciones.slice(0, -1).map((seccion, i) => ({
      desde: seccion.id,
      hacia: secciones[i + 1].id,
    }));

    const grafo = {
      titulo: tituloFormulario.trim(),
      creadoEn: Timestamp.now(),
      nodos: secciones,
      conexiones,
    };

    try {
      localStorage.setItem("formulario_generado", JSON.stringify(grafo));

      await addDoc(collection(db, "formularios"), grafo);

      Swal.fire({
        icon: "success",
        title: "Formulario guardado",
        text: "El formulario ha sido creado exitosamente.",
      });

      navigate("/forms");
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el formulario.",
      });
    }
  };

  return (
    <div className="py-10 px-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-800">
        Crear nuevo formulario
      </h1>

      {/* Título del formulario */}
      <div className="space-y-2">
        <label className="font-semibold">Título del formulario:</label>
        <input
          type="text"
          value={tituloFormulario}
          onChange={(e) => setTituloFormulario(e.target.value)}
          placeholder="Ej. Encuesta de satisfacción"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Sección para agregar nuevas secciones */}
      <div className="space-y-2">
        <label className="font-semibold">Nombre de la sección:</label>
        <input
          type="text"
          value={nombreSeccion}
          onChange={(e) => setNombreSeccion(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={agregarSeccion}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          Agregar sección
        </button>
      </div>

      {/* Sección para agregar preguntas */}
      {secciones.length > 0 && (
        <div className="space-y-2">
          <label className="font-semibold">Agregar pregunta a sección:</label>
          <select
            value={idSeccionSeleccionada || ""}
            onChange={(e) => setIdSeccionSeleccionada(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="" disabled>
              Selecciona una sección
            </option>
            {secciones.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.nombre}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={preguntaActual}
            onChange={(e) => setPreguntaActual(e.target.value)}
            placeholder="Texto de la pregunta"
            className="w-full border p-2 rounded"
          />
          <button
            onClick={agregarPregunta}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Agregar pregunta
          </button>
        </div>
      )}

      {/* Vista previa */}
      {secciones.length > 0 && (
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-bold">Vista previa:</h2>
          <div className="text-gray-700 italic">Título: {tituloFormulario}</div>
          {secciones.map((sec) => (
            <div key={sec.id} className="border p-4 rounded bg-gray-100">
              <h3 className="font-bold text-lg text-blue-700">{sec.nombre}</h3>
              <ul className="list-disc ml-6">
                {sec.preguntas.map((preg) => (
                  <li key={preg.id}>{preg.texto}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={guardarFormulario}
          className="mt-6 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg"
        >
          Guardar formulario
        </button>
      </div>
    </div>
  );
};

export default CrearForm;
