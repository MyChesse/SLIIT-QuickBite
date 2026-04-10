import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setProfileName(user?.name || "");
  }, [user?.name]);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    const storedImage = localStorage.getItem(`profileImage_${user._id}`);
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, [user?._id]);

  const displayName = user?.name || "Student User";
  const displayRole = user?.role === "staff" ? "Staff" : "Student";
  const displayEmail = user?.email || "user@my.sliit.lk";
  const displayStudentId = user?._id?.slice(-8)?.toUpperCase() || "IT22000000";

  const perks = {
    points: 2450,
    rewardName: "Free Meal",
    progress: 85,
  };

  const sidebarItems = [
    { key: "dashboard", icon: "dashboard", label: "Dashboard" },
    { key: "menu", icon: "restaurant_menu", label: "Menu" },
    { key: "orders", icon: "receipt_long", label: "My Orders" },
    { key: "favorites", icon: "favorite", label: "Favorites" },
    { key: "settings", icon: "settings", label: "Settings", active: true },
  ];

  const mobileItems = [
    { key: "home", icon: "home", label: "Home" },
    { key: "search", icon: "search", label: "Search" },
    { key: "orders", icon: "local_mall", label: "Orders" },
    { key: "account", icon: "person", label: "Account", active: true },
  ];

  const accountSettings = [
    { key: "password", icon: "lock", label: "Change Password" },
    {
      key: "notifications",
      icon: "notifications_active",
      label: "Notifications",
      badge: "On",
    },
    { key: "payments", icon: "payments", label: "Payment Methods" },
  ];

  const lastLogin = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleString()
    : new Date().toLocaleString();

  const handleMockAction = (label) => {
    toast.success(`${label} feature will be connected soon`);
  };

  const handleSaveProfile = async () => {
    const trimmedName = profileName.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSavingProfile(true);
    try {
      const result = await updateProfile({ name: trimmedName });

      if (result.success) {
        toast.success("Profile updated successfully");
        setIsEditingProfile(false);
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileName(user?.name || "");
    setIsEditingProfile(false);
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      setProfileImage(imageData);
      if (user?._id) {
        localStorage.setItem(`profileImage_${user._id}`, imageData);
      }
      toast.success("Profile photo updated");
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0d1c2e] font-['Inter']">
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 flex-col py-8 gap-2 z-40 hidden md:flex border-r border-[#d5e3fc]">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0040a1] rounded-xl flex items-center justify-center text-white font-black font-['Manrope']">
              SB
            </div>
            <div>
              <h1 className="font-['Manrope'] text-lg font-black text-blue-900 leading-tight">
                QuickBite
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Academic Dining
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleMockAction(item.label)}
              className={`w-full text-left mx-2 px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                item.active
                  ? "bg-blue-100 text-blue-800"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  item.active
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto px-2 space-y-1">
          <div className="px-4 py-6">
            <button
              type="button"
              onClick={() => handleMockAction("Order Now")}
              className="w-full bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white py-3 rounded-xl font-['Manrope'] font-bold shadow-lg shadow-[#0040a1]/20 transition-transform active:scale-95"
            >
              Order Now
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleMockAction("Help")}
            className="w-full text-slate-600 mx-2 px-4 py-3 flex items-center gap-3 hover:bg-slate-200 rounded-xl transition-all font-medium text-sm"
          >
            <span className="material-symbols-outlined">help</span>
            <span>Help</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-[#812800] mx-2 px-4 py-3 flex items-center gap-3 bg-[#ffdbc8] hover:bg-[#ffcfb3] rounded-xl transition-all font-semibold text-sm border border-[#ffb68b]"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              logout
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
        {mobileItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleMockAction(item.label)}
            className={`flex flex-col items-center justify-center px-5 py-2 ${
              item.active
                ? "bg-blue-50 text-blue-700 rounded-2xl"
                : "text-slate-400"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={
                item.active ? { fontVariationSettings: "'FILL' 1" } : undefined
              }
            >
              {item.icon}
            </span>
            <span className="text-[10px] uppercase tracking-widest mt-1">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <main className="md:ml-64 min-h-screen pb-32 md:pb-12 bg-[#f8f9ff]">
        <header className="bg-gradient-to-r from-[#0040a1] via-[#0056d2] to-[#a93802] sticky top-0 z-30 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto shadow-lg shadow-[#0040a1]/20 md:rounded-b-2xl">
          <div className="flex items-center gap-4">
            <h2 className="font-['Manrope'] text-2xl font-bold tracking-tight text-white">
              Account Settings
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleMockAction("Notifications")}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#0040a1] overflow-hidden border-2 border-white/70">
              <img
                alt="User profile"
                src={
                  profileImage ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAALeV89VJ29XSolHosB2FFM-5zaf5o-SZG94_lbzMDy19d5C9htzzdPQzqf0390OtHReqzpH3Rzl6Y_n-Ej51d0ta38Tfmb0jQjltgzcZ0z71utpRPdfGDhyg5aayR80KmtWVGfXH2lTlXQ_Htu2s6IWJO_dHEPpMxr7596gKDCYrF5DUwEm1H-BY2Hh7kukPYE9TV6vKtbJZ3xYupeXuga_PI70xwBS0XC5J3h1DbFFrOJZPTlBTRi-tP-Aiq2knIeUNNJx9wLGMR"
                }
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#eff4ff]">
                    <img
                      alt={`${displayName} avatar`}
                      src={
                        profileImage ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4qRnb37ieScYx3E4kaXJg9RdqC9JLrJuzhO1i4pBJo-JGZprr-BIBsY1z3j82Pwr-aNk_yU8UaX0UuwceifA3K9r9TMf1X4pY_7lvKwmia32-TkaNgEY8gBsayMgBJsCTDNfETrGWOfekuXwvxwbxM1pqdHBDDkx2oklBsdy3pH04s057xqIms18VMtX61NWGgYDdzPIVMC64-JGIQEh0jQNEIQ8WcjgeqBYV_CFpckxpT_6UFLILdajhXVEsf8k6O5lvOW6h8atY"
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleChoosePhoto}
                    className="absolute bottom-1 right-1 bg-[#0040a1] text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">
                      photo_camera
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </div>

                <h3 className="font-['Manrope'] text-2xl font-extrabold text-[#0d1c2e] tracking-tight">
                  {displayName}
                </h3>
                <p className="text-[#424654] font-medium mb-4">
                  {displayRole} • Faculty of Computing
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[#dae2ff] text-[#001847] text-xs font-bold rounded-full uppercase tracking-wider">
                    Active
                  </span>
                  <span className="px-3 py-1 bg-[#d5e3fc] text-[#424654] text-xs font-bold rounded-full uppercase tracking-wider">
                    Premium Member
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0040a1] to-[#0056d2] rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-xs font-bold tracking-widest opacity-80 mb-1 uppercase">
                    Dining Perks
                  </p>
                  <h4 className="font-['Manrope'] text-3xl font-black mb-6">
                    {perks.points.toLocaleString()}{" "}
                    <span className="text-sm font-medium opacity-80">pts</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined">
                            redeem
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">
                            {perks.rewardName}
                          </p>
                          <p className="text-[10px] opacity-70">
                            Progress to next reward
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-black">{perks.progress}%</p>
                    </div>

                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-full"
                        style={{ width: `${perks.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="bg-[#eff4ff] rounded-3xl p-1 md:p-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-['Manrope'] text-xl font-bold text-[#0d1c2e]">
                      Personal Information
                    </h4>
                    <div className="flex items-center gap-3">
                      {isEditingProfile && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="text-[#737785] font-bold text-sm hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={
                          isEditingProfile
                            ? handleSaveProfile
                            : () => setIsEditingProfile(true)
                        }
                        disabled={isSavingProfile}
                        className="text-[#0056d2] font-bold text-sm flex items-center gap-2 hover:underline disabled:opacity-60"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isEditingProfile ? "save" : "edit"}
                        </span>
                        {isSavingProfile
                          ? "Saving..."
                          : isEditingProfile
                            ? "Save Changes"
                            : "Edit Profile"}
                      </button>
                    </div>
                  </div>

                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#737785] tracking-wider uppercase">
                        Full Name
                      </label>
                      <input
                        className="w-full bg-[#eff4ff] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0056d2]/20 text-[#0d1c2e] font-medium transition-all"
                        type="text"
                        value={isEditingProfile ? profileName : displayName}
                        onChange={(e) => setProfileName(e.target.value)}
                        readOnly={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#737785] tracking-wider uppercase">
                        Student ID
                      </label>
                      <input
                        className="w-full bg-[#d5e3fc]/50 border-none rounded-xl px-4 py-3 text-[#424654] font-medium cursor-not-allowed"
                        type="text"
                        value={displayStudentId}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#737785] tracking-wider uppercase">
                        Email Address
                      </label>
                      <input
                        className="w-full bg-[#eff4ff] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0056d2]/20 text-[#0d1c2e] font-medium transition-all"
                        type="email"
                        value={displayEmail}
                        readOnly
                      />
                    </div>
                  </form>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="bg-[#eff4ff] rounded-3xl p-8">
                  <h4 className="font-['Manrope'] text-lg font-bold text-[#0d1c2e] mb-6">
                    Account Settings
                  </h4>
                  <div className="space-y-4">
                    {accountSettings.map((setting) => (
                      <button
                        key={setting.key}
                        type="button"
                        onClick={() => handleMockAction(setting.label)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#424654] group-hover:text-[#0056d2] transition-colors">
                            {setting.icon}
                          </span>
                          <span className="text-sm font-semibold text-[#0d1c2e]">
                            {setting.label}
                          </span>
                        </div>

                        {setting.badge ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#0056d2] font-bold uppercase">
                              {setting.badge}
                            </span>
                            <span className="material-symbols-outlined text-[#737785]">
                              chevron_right
                            </span>
                          </div>
                        ) : (
                          <span className="material-symbols-outlined text-[#737785]">
                            chevron_right
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-[#c3c6d6]/40">
                <button
                  className="text-[#ba1a1a] font-bold text-xs flex items-center gap-2 px-4 py-2 hover:bg-[#ffdad6] rounded-lg transition-colors"
                  type="button"
                  onClick={() => handleMockAction("Deactivate Account")}
                >
                  <span className="material-symbols-outlined text-sm">
                    delete_forever
                  </span>
                  Deactivate Account
                </button>
                <p className="text-[10px] text-[#737785] font-medium">
                  Last Login: {lastLogin}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-[#994700] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50"
        type="button"
        onClick={() => handleMockAction("Quick Basket")}
      >
        <span
          className="material-symbols-outlined text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          shopping_basket
        </span>
      </button>
    </div>
  );
};

export default UserDashboard;
