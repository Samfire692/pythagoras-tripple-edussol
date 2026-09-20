import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  CalendarDays,
  UserRound,
} from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../Context/AdminProvider";
import { supabase } from "../supabaseClient";

export const AdminNavbar = () => {

  const navigate = useNavigate();
  const {admin, setAdmin} = useContext(AdminContext);

  const navItems = [
    {
      name: "Management",
      path: "/adminmanagement",
      icon: CalendarDays,
    },
    {
      name: "Settings",
      path: "/adminsetting",
      icon: Settings,
    },
  ];

  const logOut = async ()=>{
    const result = await Swal.fire({
      icon:"question",
      title:"Logout",
      text:"Are you sure?",
      showCancelButton:true,
      confirmButtonText:"LogOut",
      confirmButtonColor:"blue"
    })

    if(!result.isConfirmed) return;

    await supabase.auth.signOut();
    setAdmin(null);
    localStorage.removeItem("PYTHA_ADMIN");
    navigate("/adminlogin");
  }

  

 useEffect(() => {
    // If state finishes loading/checking and there is no admin ID, redirect to login
    if (admin !== undefined && !admin?.id) {
      navigate("/adminlogin");
    }
  }, [admin, navigate]);

  return (
    <aside className="flex h-screen flex-col w-55 bg-blue-600 text-white fixed z-100">
      {/* Branding */}
      <div className="border-b border-blue-500 px-5 py-6">
        <h2
          className="text-center text-xl font-extrabold tracking-[2px]"
          style={{ fontFamily: "sans-serif" }}
        >
          Admin Page
        </h2>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-blue-500/50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-600">
            <UserRound size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              Administrator
            </p>
            <p className="truncate text-xs text-blue-100">
              Lesson Centre
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-blue-200">
          Navigation
        </p>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-blue-50 hover:bg-blue-500 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-blue-500 p-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-blue-50 transition hover:bg-red-500 hover:text-white" onClick={logOut}>
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};