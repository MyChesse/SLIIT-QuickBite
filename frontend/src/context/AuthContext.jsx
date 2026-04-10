import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const api = axios.create({
  baseURL: "http://localhost:5001",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Add token to every request
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data);
      } catch (error) {
        console.error("Failed to load user:", error);
        logout();
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      const { token: newToken, user: userData } = res.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post("/api/auth/register", {
        ...userData,
        name:
          typeof userData.name === "string"
            ? userData.name.trim()
            : userData.name,
        id: typeof userData.id === "string" ? userData.id.trim() : userData.id,
        email:
          typeof userData.email === "string"
            ? userData.email.trim().toLowerCase()
            : userData.email,
        userType:
          typeof userData.userType === "string"
            ? userData.userType.trim().toLowerCase()
            : userData.userType,
      });

      const { token: newToken, user: newUser } = res.data;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("token", newToken);

      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put("/api/auth/profile", profileData);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Update failed",
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
    assignedCanteens: user?.assignedCanteens || [], // ← New
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
