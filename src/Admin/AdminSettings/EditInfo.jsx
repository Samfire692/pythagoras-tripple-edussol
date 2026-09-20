import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../Context/AdminProvider";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

export const EditInfo = () => {
  const { admin, setAdmin } = useContext(AdminContext);

  const [logAdmin, setLogadmin] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("PYTHA_admin")
        .select("*")
        .eq("id", admin?.id)
        .maybeSingle();

      if (error) throw error;

      setLogadmin(data);

      setFormData({
        fullname: data?.fullname || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
        role: data?.role || "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (admin?.id) {
      fetchData();
    }
  }, [admin?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges =
    formData.fullname.trim() !== (logAdmin?.fullname || "") ||
    formData.email.trim() !== (logAdmin?.email || "") ||
    formData.phoneNumber.trim() !== (logAdmin?.phoneNumber || "") ||
    formData.role.trim() !== (logAdmin?.role || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin?.id) {
      toast.error("Admin not found.");
      return;
    }

    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from("PYTHA_admin")
        .update({
          fullname: formData.fullname.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          role: formData.role.trim(),
        })
        .eq("id", admin.id)
        .select()
        .single();

      if (error) throw error;

      // Update context immediately
      setAdmin((prev) => ({
        ...prev,
        ...data,
      }));

      // Update original data
      setLogadmin(data);

      // Keep form synced with database
      setFormData({
        fullname: data?.fullname || "",
        email: data?.email || "",
        phoneNumber: data?.phoneNumber || "",
        role: data?.role || "",
      });

      toast.success("Profile information updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        action=""
        className="p-3 grid gap-2"
      >
        <div className="py-2 px-1 rounded-lg border border-slate-400/50 group flex gap-2">
          <label
            htmlFor="fullname"
            className="w-28 border-r border-slate-400/50 text-slate-400/50 font-bold px-2 my-auto"
          >
            Fullname
          </label>

          <input
            id="fullname"
            name="fullname"
            type="text"
            value={formData.fullname}
            onChange={handleChange}
            disabled={saving}
            className="h-9.5 border border-slate-500/80 rounded-lg p-2 w-full disabled:opacity-50"
          />
        </div>

        <div className="py-2 px-1 rounded-lg border border-slate-400/50 group flex gap-2">
          <label
            htmlFor="email"
            className="w-28 border-r border-slate-400/50 text-slate-400/50 font-bold px-2 my-auto"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={saving}
            className="h-9.5 border border-slate-500/80 rounded-lg p-2 w-full disabled:opacity-50"
          />
        </div>

        <div className="py-2 px-1 rounded-lg border border-slate-400/50 group flex gap-2">
          <label
            htmlFor="phone"
            className="w-28 border-r border-slate-400/50 text-slate-400/50 font-bold px-2 my-auto"
          >
            +234
          </label>

          <input
            id="phone"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={saving}
            className="h-9.5 border border-slate-500/80 rounded-lg p-2 w-full disabled:opacity-50"
          />
        </div>

        <div className="py-2 px-1 rounded-lg border border-slate-400/50 group flex gap-2">
          <label
            htmlFor="role"
            className="w-28 border-r border-slate-400/50 text-slate-400/50 font-bold px-2 my-auto"
          >
            Role
          </label>

          <input
            id="role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            disabled={saving}
            className="h-9.5 border border-slate-500/80 rounded-lg p-2 w-full disabled:opacity-50"
          />
        </div>

        <div className="">
          <button
            type="submit"
            disabled={saving || !hasChanges}
            className={`p-2 w-full rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed ${
              hasChanges ? "bg-blue-600/70" : "bg-blue-300"
            }`}
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};