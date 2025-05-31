import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcRules } from "react-icons/fc";
import Swal from "sweetalert2";
import { collection, getDocs, deleteDoc, query, orderBy, doc } from "firebase/firestore";
import { db } from "/firebaseConfig.js";

const Admin = () => {
  const [formularios, setFormularios] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const navigate = useNavigate();

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

  const eliminarFormulario = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el formulario de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "formularios", id));
      setFormularios((prev) => prev.filter((form) => form.id !== id));
      Swal.fire("¡Eliminado!", "El formulario ha sido eliminado.", "success");
    } catch (error) {
      console.error("Error al eliminar formulario de Firebase:", error);
      Swal.fire("Error", "Hubo un problema al eliminar el formulario.", "error");
    }
  };

  return (
    <div className="p-1 mt-8 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setModoEdicion(!modoEdicion)}
          className="flex items-center gap-2 
                    bg-gradient-to-r from-[#2067af] to-blue-950
                    hover:from-[#1b5186] hover:to-blue-900
                    transition-all duration-200 ease-in-out text-white px-4 py-2
                    rounded-lg active:scale-95 active:shadow-md hover:scale-105"
        >
          {modoEdicion ? "Cancelar edición" : "Editar"}
        </button>
      </div>

      <div className="max-h-[80vh] overflow-y-auto h-screen mx-auto max-w-[70vw] px-4 py-4 bg-sky-800/30 rounded-2xl">
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {formularios.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full min-h-[200px]
              cursor-pointer backdrop-blur-md border border-primary flex flex-col justify-center items-center relative"
              onClick={() => navigate(`/forms/admin/${encodeURIComponent(form.titulo)}`)}
            >
              <FcRules className="text-7xl mb-2" />
              <h2 className="text-black font-semibold text-xl text-center">{form.titulo}</h2>
              <p className="text-sm text-gray-700 text-center mb-4">ID: {form.id}</p>

              {modoEdicion && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarFormulario(form.id);
                  }}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}

          {formularios.length === 0 && (
            <p className="text-gray-500 mt-10">No hay formularios disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
