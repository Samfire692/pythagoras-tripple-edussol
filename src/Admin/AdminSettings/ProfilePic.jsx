import React, { useContext, useRef, useState } from "react";
import { AdminContext } from "../../Context/AdminProvider";
import profilePic from "../../assets/admin profile pic.jfif";
import { Camera, Trash2, LoaderCircle } from "lucide-react";
import { supabase } from "../../supabaseClient"; // change path if yours is different

export const ProfilePic = () => {
  const { admin, setAdmin } = useContext(AdminContext);

  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Compress image before uploading
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");

          // Maximum dimensions
          const maxWidth = 1000;
          const maxHeight = 1000;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Image compression failed"));
                return;
              }

              resolve(blob);
            },
            "image/webp",
            0.8
          );
        };

        img.onerror = () => reject(new Error("Invalid image"));
        img.src = event.target.result;
      };

      reader.onerror = () => reject(new Error("Could not read image"));
      reader.readAsDataURL(file);
    });
  };

  // Get bucket path from existing Supabase public URL
  const getStoragePath = (url) => {
    if (!url) return null;

    try {
      const marker = "/storage/v1/object/public/profile-pics/";

      const index = url.indexOf(marker);

      if (index === -1) return null;

      return decodeURIComponent(url.substring(index + marker.length));
    } catch {
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    // Reset input so the same image can be selected again
    e.target.value = "";

    if (!file) return;

    // Only images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Original file must be <= 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be 2MB or smaller.");
      return;
    }

    if (!admin?.id) {
      alert("Admin profile not found.");
      return;
    }

    try {
      setLoading(true);

      // Compress
      const compressedImage = await compressImage(file);

      // Unique file name
      const fileName = `profile-pics/${admin.id}-${Date.now()}.webp`;

      // Upload compressed image
      const { error: uploadError } = await supabase.storage
        .from("profile_pics")
        .upload(fileName, compressedImage, {
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("profile_pics")
        .getPublicUrl(fileName);

      // Save new URL in database
      const { error: updateError } = await supabase
        .from("PYTHA_admin")
        .update({
          img: publicUrl,
        })
        .eq("id", admin.id);

      if (updateError) {
        // If DB update fails, remove newly uploaded image
        await supabase.storage
          .from("profile_pics")
          .remove([fileName]);

        throw updateError;
      }

      // Delete previous image from bucket
      if (admin.img) {
        const oldPath = getStoragePath(admin.img);

        if (oldPath) {
          await supabase.storage
            .from("profile_pics")
            .remove([oldPath]);
        }
      }

      // Update context immediately
      setAdmin((prev) => ({
        ...prev,
        img: publicUrl,
      }));
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!admin?.img || !admin?.id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const storagePath = getStoragePath(admin.img);

      // Delete image from bucket
      if (storagePath) {
        const { error: deleteError } = await supabase.storage
          .from("profile_pics")
          .remove([storagePath]);

          alert("IMAGE_URL", admin.img)
          alert("STORAGE_PATH", storagePath)

        if (deleteError) {
          throw deleteError;
        }
      }

      // Remove URL from database
      const { error: updateError } = await supabase
        .from("PYTHA_admin")
        .update({
          img: null,
        })
        .eq("id", admin.id);

      if (updateError) {
        throw updateError;
      }

      // Update context
      setAdmin((prev) => ({
        ...prev,
        img: null,
      }));
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete profile picture.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-3 h-81 flex flex-col justify-center items-center gap-5">

      {/* IMAGE */}
      <div className="relative w-38 h-38">
        <img
          src={admin?.img || profilePic}
          alt="Admin profile"
          className="w-38 h-38 object-cover shadow shadow-slate-500 rounded-full"
        />

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <LoaderCircle className="text-white animate-spin" size={30} />
          </div>
        )}

        {/* Camera */}
        {!loading && (
          <label
            htmlFor="profile-image"
            className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:scale-105 transition"
          >
            <Camera size={18} />

            <input
              ref={inputRef}
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={loading || deleting}
            />
          </label>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">

        <label
          htmlFor="profile-image"
          className={`px-4 py-2 rounded-lg bg-blue-600/70 text-white cursor-pointer ${
            loading || deleting ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {admin?.img ? "Edit photo" : "Add photo"}

          <input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={loading || deleting}
          />
        </label>

        {admin?.img && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleting}
            className="px-4 py-2 rounded-lg border border-red-500 text-red-500 flex items-center gap-2 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}

            Delete
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500">
        JPG, PNG, WEBP · Max 2MB
      </p>
    </div>
  );
};