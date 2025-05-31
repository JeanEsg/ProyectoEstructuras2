import React, { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BsFillClipboard2DataFill } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useTranslation } from "react-i18next";

const Plan = () => {
  const [planes, setPlanes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [expandidos, setExpandidos] = useState({});
  const [modoEvidencias, setModoEvidencias] = useState({});
  const [evidenciasEditadas, setEvidenciasEditadas] = useState({});
  const [auditorNombre, setAuditorNombre] = useState("");
  const [auditorId, setAuditorId] = useState("");
  const { usuario } = useAuth();
  const [objetivo, setObjetivo] = useState("");
  const [etapas, setEtapas] = useState([
    { meta: "", evidencia: "Aun no ha cargado evidencia para esta meta" },
  ]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [auditoresExternos, setAuditoresExternos] = useState([]);
  const { t } = useTranslation();

  const obtenerAuditoresExternos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios_externos"));
      const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAuditoresExternos(datos);
    } catch (error) {
      console.error("Error al obtener auditores externos:", error);
      setMensaje({ texto: "Error al obtener auditores externos", tipo: "error" });
    }
  };

  const enviarAAuditorExterno = async (planId) => {
    setCargando(true);
    try {
      const planRef = doc(db, "planes_accion", planId);
      await updateDoc(planRef, {
        enviado: true,
        auditor_externo: auditorId,
      });

      setMensaje({ texto: `${t("plan.success")}`, tipo: "exito" });
      cargarPlanes(auditorId);
    } catch (error) {
      console.error("Error al enviar a auditor externo:", error);
      setMensaje({
        texto: "Error al actualizar el plan",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const obtenerAuditorId = async () => {
    if (usuario && usuario.email) {
      try {
        const snapshot = await getDocs(collection(db, "auditores_Internos"));
        const auditores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const auditor = auditores.find(
          (a) => a.usuario.toLowerCase() === usuario.email.toLowerCase()
        );

        if (auditor) {
          setAuditorId(auditor.id);
          cargarPlanes(auditor.id);
        }
      } catch (error) {
        console.error("Error al obtener el ID del auditor:", error);
      }
    }
  };

  const toggleModoEvidencias = (planId, etapas) => {
    setModoEvidencias((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));

    if (!modoEvidencias[planId]) {
      const evidenciasIniciales = {};
      etapas.forEach((etapa, i) => {
        evidenciasIniciales[i] = etapa.evidencia || "";
      });
      setEvidenciasEditadas((prev) => ({
        ...prev,
        [planId]: evidenciasIniciales,
      }));
    }
  };

  const actualizarEvidencia = (planId, indiceEtapa, valor) => {
    setEvidenciasEditadas((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [indiceEtapa]: valor,
      },
    }));
  };

  const enviarEvidencias = async (planId) => {
    const evidencias = Object.entries(evidenciasEditadas[planId] || {}).map(
      ([indice, evidencia]) => ({
        indice_etapa: parseInt(indice),
        evidencia,
      })
    );

    setCargando(true);
    try {
      const planRef = doc(db, "planesAccion", planId);
      await updateDoc(planRef, {
        evidencias,
      });

      setMensaje({ texto: `${t("plan.evidence_s")}`, tipo: "exito" });
      cargarPlanes(auditorId);
      setModoEvidencias((prev) => ({ ...prev, [planId]: false }));
    } catch (error) {
      console.error("Error al enviar evidencias:", error);
      setMensaje({ texto: "Error al guardar evidencias", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  const cargarPlanes = async (auditorId) => {
    setCargando(true);
    try {
      const q = query(collection(db, "planes_accion"), where("auditor_interno", "==", auditorId));
      const snapshot = await getDocs(q);
      const planes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlanes(planes);
    } catch (error) {
      console.error("Error al cargar planes:", error);
      setMensaje({ texto: "Error al cargar planes de acción", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async () => {
    if (!usuario || !auditorId) {
      setMensaje({ texto: "No se pudo identificar al auditor interno actual", tipo: "error" });
      return;
    }

    if (etapas.some((etapa) => !etapa.meta)) {
      setMensaje({ texto: "Todas las metas deben tener contenido", tipo: "error" });
      return;
    }

    const nuevoPlan = {
      objetivo,
      etapas,
      auditor_interno: auditorId,
      comentario: "No se han realizado comentarios",
      estado: "pendiente",
      creado_en: new Date(),
    };

    setCargando(true);
    try {
      await addDoc(collection(db, "planes_accion"), nuevoPlan);

      setMensaje({ texto: `${t("plan.save")}`, tipo: "exito" });
      setObjetivo("");
      setEtapas([{ meta: "", evidencia: "Aun no ha cargado evidencia para esta meta" }]);
      setMostrarFormulario(false);
      cargarPlanes(auditorId);
    } catch (error) {
      setMensaje({ texto: "Error al guardar el plan", tipo: "error" });
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  const agregarEtapa = () => {
    setEtapas([
      ...etapas,
      { meta: "", evidencia: "Aun no ha cargado evidencia para esta meta" },
    ]);
  };

  const eliminarEtapa = (index) => {
    if (etapas.length > 1) {
      const nuevasEtapas = [...etapas];
      nuevasEtapas.splice(index, 1);
      setEtapas(nuevasEtapas);
    }
  };

  const actualizarEtapa = (index, campo, valor) => {
    const nuevasEtapas = [...etapas];
    nuevasEtapas[index] = { ...nuevasEtapas[index], [campo]: valor };
    setEtapas(nuevasEtapas);
  };

  const toggleExpandido = (id) => {
    setExpandidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-slate-200 mx-auto rounded-2xl shadow-sm flex-1 p-8 max-h-[80vh] max-w-[70vw] overflow-y-auto space-y-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <BsFillClipboard2DataFill className="mr-2 text-primary" />
              {t("plan.title")}
            </h1>

            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="px-4 py-2 font-semibold
        bg-gradient-to-r from-sky-800 to-sky-950
        hover:from-sky-700 hover:to-sky-900
        active:from-sky-900 active:to-sky-950
        text-white rounded-md flex items-center justify-center
        transition-all duration-200 ease-in-out
        shadow-md hover:shadow-lg active:shadow-inner
        hover:scale-100 active:scale-95"
            >
              {mostrarFormulario
                ? `${t("users.cancel")}`
                : `${t("plan.create1")}`}
              {!mostrarFormulario && <Plus className="ml-1" size={18} />}
            </button>
          </div>

          {usuario && (
            <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 mb-2 max-w-md">
              <p className="text-blue-800">
                <span className="font-medium">{t("sign_up.rols.r1")}:</span>{" "}
                {auditorNombre || "Cargando..."}
              </p>
            </div>
          )}
        </div>

        {/* Mensajes de notificación */}
        {mensaje.texto && (
          <div
            className={`p-4 mb-4 rounded-md ${mensaje.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {mensaje.texto}
          </div>
        )}

        {/* Formulario para Crear Plan */}
        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t("plan.create")}</h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  {t("plan.objective")}
                </label>
                <textarea
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  required
                  placeholder={t("plan.sub2")}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  {t("plan.sub1")}
                </label>
                {etapas.map((etapa, index) => (
                  <div
                    key={index}
                    className="mb-3 p-4 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">
                        {t("plan.etapa")} {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => eliminarEtapa(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={etapas.length <= 1}
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-600 text-sm mb-1">
                        {t("plan.meta")}
                      </label>
                      <textarea
                        value={etapa.meta}
                        onChange={(e) =>
                          actualizarEtapa(index, "meta", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="2"
                        required
                        placeholder={t("plan.sub3")}
                      ></textarea>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={agregarEtapa}
                  className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" /> {t("plan.add")}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={cargando}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md flex items-center"
                >
                  {cargando ? t("plan.loading") : t("plan.save2")}
                  {!cargando && <CheckCircle size={18} className="ml-1" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Planes */}
        <div className="h-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <div>
            {cargando ? (
              <div className="text-center py-8">{t("plan.loading2")}</div>
            ) : planes.length > 0 ? (
              <div className="space-y-4">
                {planes.map((plan) => (
                  <div
                    key={plan._id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <div
                      className="bg-gray-50 p-4 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleExpandido(plan._id)}
                    >
                      <div>
                        <h3 className="font-medium text-lg">{plan.objetivo}</h3>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${plan.estado === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : plan.estado === "Evaluado"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                              }`}
                          >
                            {plan.estado.charAt(0).toUpperCase() +
                              plan.estado.slice(1)}
                          </span>
                        </div>
                      </div>
                      {expandidos[plan._id] ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {expandidos[plan._id] && (
                      <div className="p-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-2">
                          {t("plan.e")}
                        </h4>
                        {plan.etapas.map((etapa, idx) => (
                          <div
                            key={idx}
                            className="mb-3 p-3 bg-gray-50 rounded"
                          >
                            <p className="font-medium">Meta {idx + 1}:</p>
                            <p className="text-gray-700">{etapa.meta}</p>
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-600">
                                {t("plan.evidencia")}
                              </p>
                              {modoEvidencias[plan._id] ? (
                                <textarea
                                  value={
                                    evidenciasEditadas[plan._id]?.[idx] ??
                                    etapa.evidencia ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    actualizarEvidencia(
                                      plan._id,
                                      idx,
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                                  rows="2"
                                />
                              ) : (
                                <p className="text-sm text-gray-600">
                                  {etapa.evidencia ===
                                    "Aun no ha cargado evidencia para esta meta" ? (
                                    <span className="italic text-gray-500">
                                      {etapa.evidencia}
                                    </span>
                                  ) : (
                                    etapa.evidencia
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-3">
                          <p className="font-medium text-gray-700">
                            {t("plan.comment")}
                          </p>
                          <p className="text-gray-600">{plan.comentario}</p>
                        </div>

                        {modoEvidencias[plan._id] && (
                          <div className="flex justify-end mt-4">
                            <button
                              onClick={() => enviarEvidencias(plan._id)}
                              className="bg-primary hover:bg-blue-800 text-white py-2 px-6 rounded-md"
                              disabled={cargando}
                            >
                              {cargando ? t("plan.l_send") : t("plan.send")}
                            </button>
                          </div>
                        )}

                        <div className="flex justify-between mt-5">
                          <button
                            onClick={() => enviarAAuditorExterno(plan._id)}
                            className=" text-white p-2 rounded-lg font-semibold
             bg-gradient-to-r from-sky-800 to-sky-950
             hover:from-sky-700 hover:to-sky-900
             active:scale-95 active:from-sky-900 active:to-sky-950
             transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:shadow-inner"
                            disabled={cargando}
                          >
                            {cargando ? t("plan.l_send") : t("plan.send2")}
                          </button>
                          <button
                            onClick={() =>
                              toggleModoEvidencias(plan._id, plan.etapas)
                            }
                            className={`text-sm font-medium ${modoEvidencias[plan._id]
                              ? "text-red-600 hover:text-red-800"
                              : "text-blue-600 hover:text-blue-800"
                              }`}
                            disabled={cargando}
                          >
                            {modoEvidencias[plan._id]
                              ? t("users.cancel")
                              : t("plan.a_evidencia")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : usuario ? (
              <div className="text-center py-8 text-gray-600">
                {t("plan.void")}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                Para ver sus planes de acción, debe iniciar sesión como auditor
                interno.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
