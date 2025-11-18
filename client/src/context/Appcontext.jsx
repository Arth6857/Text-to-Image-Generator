import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(null);              // ✅ number/null (not boolean)

  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");
  const navigate = useNavigate();

  const authHeaders = {
    Authorization: token ? `Bearer ${token}` : undefined,  // ✅ add Bearer
    token: token || undefined,                              // keep for compatibility
  };

  // ✅ load credits
  const loadCreditsData = async () => {
    try {
      //call the credits api
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, { headers: authHeaders });
      //check resonse
      if (data.success) {
        setCredit(data.credits);  // ✅ map field
        if (data.user) setUser(data.user);
      } else {
        toast.error(data?.message || "Error in loading credits");
        setCredit(0);
      }
    } catch {
      toast.error("Error in loading credits");
      setCredit(0);
    }
  };

  // ✅ generate image (use actual route + refresh credits)
  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generateImage`,            // ← was /generate-image
        { prompt },
        { headers: authHeaders }
      );
      if (data?.success) {
        await loadCreditsData();
        return data.resultImage || data.image;
      } else {
        toast.error(data?.message || "Failed to generate image");
        await loadCreditsData();
        if    (data.creditBalance=== 0) navigate("/buy");
      }
    } catch {
      toast.error("Error in generating image");
    }
  };

  // ✅ logout clears everything
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setCredit(null);
  };

  // ✅ keep state & localStorage in sync when you set token after login
  const setTokenAndStore = (t) => {
    setToken(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) loadCreditsData();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken: setTokenAndStore,         // ✅ use synced setter
    credit,
    setCredit,
    logout,
    loadCreditsData,
    generateImage,
  };

  return <Appcontext.Provider value={value}>{props.children}</Appcontext.Provider>;
};

export default AppcontextProvider;


//   // ✅ generate image (align route name; handle both response shapes)
//   const generateImage = async (prompt) => {
//     try {
//       // use the route name you actually mounted in backend:
//       // if your router is router.post('/generateImage'...) use that path:
//       const { data } = await api.post("/api/image/generateImage", { prompt });
//       if (data?.success) {
//         await loadCreditsData();
//         return data.resultImage || data.image; // supports both keys
//       } else {
//         toast.error(data?.message || "Failed to generate image");
//         await loadCreditsData();
//         if ((data?.credits ?? data?.creditBalance ?? 0) <= 0) navigate("/buy");
//       }
//     } catch (err) {
//       toast.error("Error in generating image");
//     }
//   };

//   // ✅ logout
//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     setUser(null);
//     setCredit(null);
//   };

//   // ✅ keep context in sync with saved token
//   useEffect(() => {
//     if (token) loadCreditsData();
//   }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

//   const value = {
//     user,
//     setUser,
//     showLogin,
//     setShowLogin,
//     backendUrl,
//     token,
//     setToken: (t) => {
//       setToken(t);
//       if (t) localStorage.setItem("token", t);
//       else localStorage.removeItem("token");
//     },
//     credit,
//     setCredit,
//     logout,
//     loadCreditsData,
//     generateImage,
//   };

//   return <Appcontext.Provider value={value}>{props.children}</Appcontext.Provider>;
// };

// export default AppcontextProvider;
