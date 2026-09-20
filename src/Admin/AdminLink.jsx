import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Save,
  LoaderCircle,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";

const CONTACT_ID = "00000000-0000-0000-0000-000000000001";

export const AdminLink = () => {
  const [form, setForm] = useState({
    address1: "",
    address2: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email: "",
    whatsapp: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH CONTACT INFO
  // =========================
  const fetchContact = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("PYTHA_contact")
        .select("*")
        .eq("id", CONTACT_ID)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setForm({
          address1: data.address1 || "",
          address2: data.address2 || "",
          phone1: data.phone1 || "",
          phone2: data.phone2 || "",
          phone3: data.phone3 || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE CONTACT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.address1.trim()) {
      toast.error("Address 1 is required");
      return;
    }

    if (!form.phone1.trim()) {
      toast.error("Phone number 1 is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email address is required");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("PYTHA_contact")
        .update({
          address1: form.address1.trim(),
          address2: form.address2.trim() || null,
          phone1: form.phone1.trim(),
          phone2: form.phone2.trim() || null,
          phone3: form.phone3.trim() || null,
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", CONTACT_ID);

      if (error) throw error;

      toast.success("Contact information updated successfully");

      await fetchContact();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoaderCircle className="animate-spin text-blue-600" size={35} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl rounded-2xl bg-white p-5 shadow-sm md:p-8">
      {/* HEADER */}
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-800">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update the contact details displayed across the website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ADDRESS 1 */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin size={18} className="text-blue-600" />
            Address 1
          </label>

          <textarea
            name="address1"
            value={form.address1}
            onChange={handleChange}
            placeholder="Enter primary address"
            rows={3}
            required
            disabled={saving}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />
        </div>

        {/* ADDRESS 2 */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin size={18} className="text-blue-600" />
            Address 2
            <span className="text-xs font-normal text-gray-400">
              (Optional)
            </span>
          </label>

          <textarea
            name="address2"
            value={form.address2}
            onChange={handleChange}
            placeholder="Enter secondary address"
            rows={3}
            disabled={saving}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />
        </div>

        {/* PHONE NUMBERS */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Phone size={18} className="text-blue-600" />
            Phone Numbers
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            {/* PHONE 1 */}
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Phone 1
              </label>

              <input
                type="tel"
                name="phone1"
                value={form.phone1}
                onChange={handleChange}
                placeholder="08012345678"
                required
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            {/* PHONE 2 */}
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Phone 2
              </label>

              <input
                type="tel"
                name="phone2"
                value={form.phone2}
                onChange={handleChange}
                placeholder="08012345678"
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            {/* PHONE 3 */}
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Phone 3
              </label>

              <input
                type="tel"
                name="phone3"
                value={form.phone3}
                onChange={handleChange}
                placeholder="08012345678"
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Mail size={18} className="text-blue-600" />
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            required
            disabled={saving}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />
        </div>

        {/* WHATSAPP */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MessageCircle size={18} className="text-green-600" />
            WhatsApp
            <span className="text-xs font-normal text-gray-400">
              (Optional)
            </span>
          </label>

          <input
            type="tel"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="08012345678"
            disabled={saving}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
          />
        </div>

        {/* UPDATE BUTTON */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={19} />
                Update Contact Information
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};