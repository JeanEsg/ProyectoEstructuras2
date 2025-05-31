import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "/firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const DEFAULT_PASSWORD = "123456";

const UsuariosForm = ({ onUsuarioCreado }) => {
    const [name, setName] = useState("");
    const [rol, setRol] = useState("auditor_interno");
    const [adminCode, setAdminCode] = useState("");
    const [email, setEmail] = useState("");
    const [compania, setCompania] = useState("");
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (rol === "admin") {
                const codeRef = doc(db, "adminCodes", "adminAccess");
                const codeSnap = await getDoc(codeRef);
                if (
                    !codeSnap.exists() ||
                    String(codeSnap.data().codigo) !== adminCode.trim()
                ) {
                    Swal.fire({
                        icon: "error",
                        title: "Código incorrecto",
                        text: "Código de administrador incorrecto.",
                    });
                    return;
                }
            }

            const cred = await createUserWithEmailAndPassword(
                auth,
                email,
                DEFAULT_PASSWORD
            );

            const userData = {
                name,
                email,
                rol,
                uid: cred.user.uid,
                creadoEn: new Date(),
                ...(rol === "auditor_interno" && { compania }),
            };

            await setDoc(doc(db, "usuarios", cred.user.uid), userData);

            if (rol === "auditor_interno") {
                await setDoc(doc(db, "usuarios_internos", cred.user.uid), {
                    nombre: name,
                    usuario: email,
                    compañia: compania,
                    creadoEn: new Date(),
                });
            }

            if (rol === "auditor_externo") {
                await setDoc(doc(db, "usuarios_externos", cred.user.uid), {
                    nombre: name,
                    usuario: email,
                    creadoEn: new Date(),
                });
            }

            Swal.fire({
                icon: "success",
                title: "Usuario creado",
                text: `Usuario creado exitosamente. Contraseña por defecto: "${DEFAULT_PASSWORD}"`,
            });
            setName("");
            setRol("auditor_interno");
            setAdminCode("");
            setEmail("");
            setCompania("");

            if (onUsuarioCreado) onUsuarioCreado();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al crear usuario: " + err.message,
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-4 rounded mb-6 space-y-4"
        >
            <input
                className="w-full p-2 border rounded"
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <select
                className="w-full p-2 border rounded"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
            >
                <option value="auditor_interno">Auditor Interno</option>
                <option value="auditor_externo">Auditor Externo</option>
                <option value="admin">Administrador</option>
            </select>

            {rol === "admin" && (
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    placeholder="Código Admin"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                />
            )}

            {rol === "auditor_interno" && (
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    placeholder="Compañía"
                    value={compania}
                    onChange={(e) => setCompania(e.target.value)}
                    required
                />
            )}

            <input
                className="w-full p-2 border rounded"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <p className="text-sm text-gray-600">
                Se asignará la contraseña por defecto:{" "}
                <strong>{DEFAULT_PASSWORD}</strong>. El usuario deberá cambiarla más
                tarde desde su perfil.
            </p>

            <button
                type="submit"
                className="w-full items-center gap-2 
          bg-gradient-to-r from-[#2067af] to-blue-950
          hover:from-[#1b5186] hover:to-blue-900
          transition-all duration-200 ease-in-out text-white px-4 py-2
          rounded-lg active:scale-65 active:shadow-md hover:scale-105"
            >
                Crear Usuario
            </button>
        </form>
    );
};

export default UsuariosForm;
