import React, { useEffect, useState } from "react";
import {
  ImagePlus,
  Save,
  X,
  Loader2,
  Eye,
  EyeOff,
  Clock3,
  Megaphone,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../supabaseClient";

const POPUP_ID = "00000000-0000-0000-0000-000000000001";
const BUCKET = "popup-images";

export const AdminPopup = () => {
  const [popup, setPopup] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [text, setText] = useState("");
  const [time, setTime] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH POPUP
  // =========================
  useEffect(() => {
    fetchPopup();
  }, []);

  const fetchPopup = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("PYTHA_popup")
      .select("*")
      .eq("id", POPUP_ID)
      .single();

    if (error) {
      console.error(error);
      toast.error("Failed to load popup");
      setLoading(false);
      return;
    }

    setPopup(data);

    setText(data.text || "");
    setTime(data.time ? data.time.slice(0, 5) : "");
    setActive(data.active ?? true);
    setPreview(data.image || "");

    setLoading(false);
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be below 2MB");
      return;
    }

    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // =========================
  // CANCEL IMAGE CHANGE
  // =========================
  const removeSelectedImage = () => {
    setImage(null);
    setPreview(popup?.image || "");
  };

  // =========================
  // STORAGE PATH
  // =========================
  const getStoragePath = (url) => {
    if (!url) return null;

    const marker = `/storage/v1/object/public/${BUCKET}/`;

    if (!url.includes(marker)) return null;

    return url.split(marker)[1];
  };

  // =========================
  // SAVE POPUP
  // =========================
  const handleSave = async () => {
    if (!popup?.image && !image) {
      toast.error("Popup image is required");
      return;
    }

    setSaving(true);

    let uploadedPath = null;

    try {
      let imageUrl = popup?.image;

      // =========================
      // UPLOAD NEW IMAGE
      // =========================
      if (image) {
        const fileExt = image.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `popup-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, image, {
            cacheControl: "3600",
            upsert: false,
            contentType: image.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        uploadedPath = fileName;

        const { data: publicData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(fileName);

        imageUrl = publicData.publicUrl;
      }

      // =========================
      // UPDATE DATABASE
      // =========================
      const { data, error } = await supabase
        .from("PYTHA_popup")
        .update({
          image: imageUrl,
          text: text.trim() || null,
          time: time || null,
          active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", POPUP_ID)
        .select()
        .single();

      if (error) {
        // If DB update failed after uploading,
        // remove the newly uploaded image.
        if (uploadedPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([uploadedPath]);
        }

        throw error;
      }

      // =========================
      // DELETE OLD IMAGE
      // =========================
      if (image && popup?.image) {
        const oldPath = getStoragePath(popup.image);

        if (oldPath) {
          const { error: deleteError } = await supabase.storage
            .from(BUCKET)
            .remove([oldPath]);

          if (deleteError) {
            console.error("Old image deletion failed:", deleteError);
          }
        }
      }

      // =========================
      // UPDATE LOCAL STATE
      // =========================
      setPopup(data);
      setImage(null);
      setPreview(data.image || "");
      setText(data.text || "");
      setTime(data.time ? data.time.slice(0, 5) : "");
      setActive(data.active ?? true);

      toast.success("Popup updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update popup");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-gray-500"
        />
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div className="w-full mx-auto">
      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-900 text-white">
              <Megaphone size={21} />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Popup Management
              </h1>

              <p className="text-sm text-gray-500">
                Manage the popup displayed on your website.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchPopup}
          disabled={loading || saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* =========================
          MAIN GRID
      ========================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* =========================
            EDIT SECTION
        ========================= */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Edit Popup
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Update the content and appearance of your popup.
            </p>
          </div>

          <div className="p-6 space-y-6">

            {/* =========================
                IMAGE UPLOAD
            ========================= */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Popup Image{" "}
                <span className="text-red-500">*</span>
              </label>

              {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={preview}
                    alt="Popup"
                    className="w-full h-70 object-contain"
                  />

                  {image && (
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      disabled={saving}
                      className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/75 text-white hover:bg-black transition disabled:opacity-50"
                    >
                      <X size={18} />
                    </button>
                  )}

                  {image && (
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/75 text-white text-xs font-medium">
                      New image selected
                    </div>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="popup-image"
                  className="flex flex-col items-center justify-center h-70 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition"
                >
                  <ImagePlus
                    size={42}
                    className="text-gray-400 mb-3"
                  />

                  <span className="text-sm font-semibold text-gray-700">
                    Upload popup image
                  </span>

                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, JPEG or WEBP
                  </span>

                  <span className="text-xs text-gray-400">
                    Maximum 2MB
                  </span>
                </label>
              )}

              <input
                id="popup-image"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                disabled={saving}
                className="hidden"
              />

              {preview && (
                <div className="flex items-center gap-3 mt-3">
                  <label
                    htmlFor="popup-image"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <ImagePlus size={17} />
                    Replace Image
                  </label>

                  {image && (
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      disabled={saving}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* =========================
                TEXT
            ========================= */}
            <div>
              <label
                htmlFor="popup-text"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Popup Text
                <span className="ml-2 text-xs font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <textarea
                id="popup-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={saving}
                rows={4}
                maxLength={500}
                placeholder="Enter your popup message..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 disabled:bg-gray-100"
              />

              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {text.length}/500
                </span>
              </div>
            </div>

            {/* =========================
                TIME
            ========================= */}
            <div>
              <label
                htmlFor="popup-time"
                className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2"
              >
                <Clock3 size={16} />

                Popup Time

                <span className="text-xs font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <input
                id="popup-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10 disabled:bg-gray-100"
              />

              <p className="text-xs text-gray-400 mt-2">
                Leave empty if you don't want to specify a time.
              </p>
            </div>

            {/* =========================
                ACTIVE TOGGLE
            ========================= */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    active
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {active ? (
                    <Eye size={19} />
                  ) : (
                    <EyeOff size={19} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Popup Visibility
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {active
                      ? "Popup is currently visible."
                      : "Popup is currently hidden."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActive(!active)}
                disabled={saving}
                className={`relative w-12 h-6 rounded-full transition ${
                  active ? "bg-green-500" : "bg-gray-300"
                } disabled:opacity-50`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                    active ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* =========================
              SAVE FOOTER
          ========================= */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Changes will update the current popup.
            </p>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Popup
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================
            LIVE PREVIEW
        ========================= */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-gray-700" />

              <h2 className="font-semibold text-gray-900">
                Popup Preview
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              This is approximately how your popup will appear.
            </p>
          </div>

          <div className="flex items-center justify-center min-h-150 p-5 md:p-8">

            {/* POPUP */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

              {/* IMAGE */}
              {preview ? (
                <div className="relative bg-gray-100">
                  <img
                    src={preview}
                    alt="Popup preview"
                    className="w-full max-h-87.5 object-contain"
                  />

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center">
                    <X size={16} />
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                  <ImagePlus size={40} />
                  <p className="text-sm mt-2">
                    No popup image
                  </p>
                </div>
              )}

              {/* CONTENT */}
              <div className="p-5">

                {text ? (
                  <p className="text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                    {text}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-400">
                    No popup text
                  </p>
                )}

                {time && (
                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                    <Clock3 size={14} />
                    {time}
                  </div>
                )}

                <button
                  type="button"
                  className="w-full mt-5 rounded-xl bg-gray-900 text-white py-3 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                active ? "text-green-600" : "text-gray-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  active ? "bg-green-500" : "bg-gray-400"
                }`}
              />

              {active
                ? "Popup is active"
                : "Popup is hidden"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};