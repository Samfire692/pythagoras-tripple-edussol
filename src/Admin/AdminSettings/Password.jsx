import React, { useContext, useState } from "react";
import { AdminContext } from "../../Context/AdminProvider";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

export const Password = () => {
  const { admin } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin?.email) {
      toast.error("Admin email not found.");
      return;
    }

    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.error("New password must be different from your old password.");
      return;
    }

    try {
      setSaving(true);

      // 1. Verify old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: admin.email,
        password: formData.oldPassword,
      });

      if (signInError) {
        toast.error("Old password is incorrect.");
        return;
      }

      // 2. Change password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) throw updateError;

      toast.success("Password changed successfully.");

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="p-3 grid gap-2"
      >
        <div className="py-2 px-1 rounded-lg border border-slate-400/50 group flex gap-2">
          <label
            htmlFor="oldPassword"
            className="w-28 border-r border-slate-400/50 text-slate-400/50 font-bold px-2 my-auto"
          >
            Old Password
          </label>

          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            disabled={saving}
            placeholder="Enter old password"
            className="h-9.5 border border-slate-500/80 rounded-lg p-2 w-full disabled:opacity-50"
          />
        </div>

        <div className="py-2 px-1 rounded-lg border border-slate-400/50 group flex gap-2">
          <label
            htmlFor="newPassword"
            className="w-28 border-r border-slate-400/50 text-slate-400/50 font-bold px-2 my-auto"
          >
            New Password
          </label>

          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={saving}
            placeholder="Enter new password"
            className="h-9.5 border border-slate-500/80 rounded-lg p-2 w-full disabled:opacity-50"
          />
        </div>

        <div className="py-2 px-1 rounded-lg border border-slate-400/50 group flex gap-2">
          <label
            htmlFor="confirmPassword"
            className="w-28 border-r border-slate-400/50 text-slate-400/50 font-bold px-2 my-auto"
          >
            Confirm
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={saving}
            placeholder="Confirm new password"
            className="h-9.5 border border-slate-500/80 rounded-lg p-2 w-full disabled:opacity-50"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className={`p-2 w-full rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed ${!formData.oldPassword || !formData.newPassword || !formData.confirmPassword ? "bg-blue-200" :"bg-blue-600/70"}`}
          >
            {saving ? "Changing Password..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};