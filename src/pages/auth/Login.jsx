import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const lockDuration = 20 * 1000;

  const languages = [
    { code: "es", label: "Español" },
    { code: "gb", label: "English", langCode: "en" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
  ];

  useEffect(() => {
    const storedAttempts = localStorage.getItem("failedAttempts") || 0;
    const lockTime = localStorage.getItem("lockTime");

    setFailedAttempts(parseInt(storedAttempts));

    if (lockTime && Date.now() < parseInt(lockTime)) {
      const timeLeft = parseInt(lockTime) - Date.now();
      setIsLocked(true);
      startLockCountdown(timeLeft); 
    } else {
      clearLockState(); 
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const startLockCountdown = (duration) => {
    setRemainingTime(Math.ceil(duration / 1000));

    const id = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          clearLockState();  
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(id);
  };

  const clearLockState = () => {
    setIsLocked(false);
    localStorage.removeItem("failedAttempts");
    localStorage.removeItem("lockTime");
    setFailedAttempts(0);
  };

  const handleChangeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLocked) {
      setError("Demasiados intentos fallidos. Inténtalo más tarde.");
      return;
    }

    try {
      const credencial = await signInWithEmailAndPassword(auth, email, password);
      const user = credencial.user;

      clearLockState();

      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError(`${t("log_in.exist")}`);
        return;
      }

      const userData = docSnap.data();
      const { rol } = userData;

      login({ uid: user.uid, email: user.email, rol });
      navigate("/index", { replace: true });
    } catch (err) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem("failedAttempts", newAttempts);

      if (newAttempts >= 4) {
        const lockTime = Date.now() + lockDuration;
        localStorage.setItem("lockTime", lockTime.toString());
        setIsLocked(true);
        startLockCountdown(lockDuration);
      }

      setError(`${t("log_in.error")}`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      <img
        src="https://cdn.pixabay.com/photo/2017/06/14/01/43/background-2400765_1280.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <Link to="/" className="absolute m-10 z-50 top-[1%] left-[2%]">
        <FaArrowLeft className="text-3xl xl:text-4xl text-white rounded-full" />
      </Link>
      <div className="absolute m-10 z-50 top-[1%] right-[2%]">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className={`p-2 rounded-full`}
        >
          <MdLanguage className="text-white hover:text-sky-950 text-4xl transition-colors duration-300" />
        </button>
        {showLangMenu && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
            <ul className="py-1 text-sm text-gray-700">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() =>
                      handleChangeLanguage(lang.langCode || lang.code)
                    }
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                  >
                    <span className={`fi fi-${lang.code} mr-2`}></span>{" "}
                    {lang.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="relative z-10 bg-white bg-opacity-5 shadow-white rounded-xl p-6 max-w-xs w-full min-h-[420px] backdrop-blur-md border border-sky-800">
        <h2 className="text-center text-3xl italic tracking-wide font-bold text-white mb-5">
          {t("log_in.title")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              className="w-full p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
              type="email"
              placeholder={t("log_in.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className="absolute right-3 top-2 text-white">👤</i>
          </div>

          <div className="mb-4 relative">
            <input
              className="w-full py-2 px-8 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
              type={showPassword ? "text" : "password"}
              placeholder={t("log_in.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="absolute right-3 top-2 text-white">🔒</i>
            {showPassword ? (
              <RiEyeOffFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 left-2 text-[#161236] hover:cursor-pointer"
              />
            ) : (
              <RiEyeFill
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 left-2 text-[#161236] hover:cursor-pointer"
              />
            )}
          </div>

          <div className="mb-2 text-white text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 my-2" />
              {t("log_in.terms")}
            </label>
          </div>

          <button
            type="submit"
            disabled={isLocked} 
            className="w-full text-white p-2 rounded-lg font-semibold
             bg-gradient-to-r from-sky-800 to-sky-950
             hover:from-sky-700 hover:to-sky-900
             active:scale-95 active:from-sky-900 active:to-sky-950
             transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:shadow-inner
             disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocked ? "Bloqueado..." : t("log_in.button")}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
        )}

        <p className="text-center text-white text-sm mt-4">
          {t("log_in.p1")}{" "}
          <Link to="/Sign" className="underline text-white hover:text-blue-300">
            {t("log_in.register")}
          </Link>
        </p>
      </div>

      {isLocked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Acceso Bloqueado</h2>
            <p className="text-gray-700 mb-4">
              Demasiados intentos fallidos. Por favor espera <strong>{remainingTime}</strong> segundos para intentar nuevamente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
