import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = ({ activePage = "" }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const sidebarButtonClass =
    "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition";
  const sidebarActiveClass =
    "w-full flex items-center gap-3 rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm font-semibold";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex w-[250px] flex-col bg-white border-r border-slate-200 px-5 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
            🎓
          </div>
          <div>
            <h2 className="text-[28px] leading-none font-bold text-blue-900">
              Admin Portal
            </h2>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mt-1">
              Canteen Management
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className={
            activePage === "users" ? sidebarActiveClass : sidebarButtonClass
          }
        >
          <span className="text-base">👥</span>
          <span>User Management</span>
        </button>

        <button
          onClick={() => navigate("/admin/complaints")}
          className={
            activePage === "complaints"
              ? sidebarActiveClass
              : sidebarButtonClass
          }
        >
          <span className="text-base">⚠️</span>
          <span>Complaint Management</span>
        </button>

        <button
          onClick={() => navigate("/admin/feedback")}
          className={
            activePage === "feedback" ? sidebarActiveClass : sidebarButtonClass
          }
        >
          <span className="text-base">💬</span>
          <span>Feedback Management</span>
        </button>

        <button
          onClick={() => navigate("/admin/promotions")}
          className={
            activePage === "promotions"
              ? sidebarActiveClass
              : sidebarButtonClass
          }
        >
          <span className="text-base">🍽️</span>
          <span>Promotion Management</span>
        </button>

        <button
          onClick={() => navigate("/admin/inventory")}
          className={
            activePage === "inventory" ? sidebarActiveClass : sidebarButtonClass
          }
        >
          <span className="text-base">📦</span>
          <span>Inventory</span>
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          className={
            activePage === "orders" ? sidebarActiveClass : sidebarButtonClass
          }
        >
          <span className="text-base">🛒</span>
          <span>Orders</span>
        </button>

        <button
          onClick={() => navigate("/admin/analytics")}
          className={
            activePage === "analytics" ? sidebarActiveClass : sidebarButtonClass
          }
        >
          <span className="text-base">📊</span>
          <span>Analytics</span>
        </button>
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.name || "Admin User"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.email || "admin@sliit.lk"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
