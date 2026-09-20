import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";
import { AdminContext } from "../../Context/AdminProvider";
import Swal from "sweetalert2";

export const Role = () => {
  const { admin } = useContext(AdminContext);

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const BUCKET = "team-image";

  // ==============================
  // FETCH TEAM
  // ==============================

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("PYTHA_team")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      setTeam(data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // RESET FORM
  // ==============================

  const resetForm = () => {
    setFullname("");
    setBio("");
    setImage(null);
    setPreview("");
    setEditingTeam(null);
    setShowForm(false);
  };

  // ==============================
  // OPEN ADD FORM
  // ==============================

  const handleAdd = () => {
    setEditingTeam(null);
    setFullname("");
    setBio("");
    setImage(null);
    setPreview("");
    setShowForm(true);
  };

  // ==============================
  // OPEN EDIT FORM
  // ==============================

  const handleEdit = (member) => {
    setEditingTeam(member);

    setFullname(member.fullname || "");
    setBio(member.bio || "");
    setImage(null);
    setPreview(member.img || "");

    setShowForm(true);
  };

  // ==============================
  // IMAGE SELECT
  // ==============================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check image type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    // 2MB limit
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // ==============================
  // GET STORAGE PATH
  // ==============================

  const getStoragePath = (url) => {
    if (!url) return null;

    const marker = `/storage/v1/object/public/${BUCKET}/`;

    if (!url.includes(marker)) return null;

    return decodeURIComponent(url.split(marker)[1]);
  };

  // ==============================
  // UPLOAD IMAGE
  // ==============================

  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();

    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ==============================
  // SAVE TEAM MEMBER
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullname.trim()) {
      toast.error("Full name is required");
      return;
    }

    // Image required only when adding
    if (!editingTeam && !image) {
      toast.error("Profile image is required");
      return;
    }

    setSaving(true);

    let uploadedImageUrl = editingTeam?.img || null;

    try {
      // ==========================
      // UPLOAD NEW IMAGE
      // ==========================

      if (image) {
        uploadedImageUrl = await uploadImage(image);
      }

      // ==========================
      // ADD MEMBER
      // ==========================

      if (!editingTeam) {
        const { error } = await supabase
          .from("PYTHA_team")
          .insert({
            fullname: fullname.trim(),
            bio: bio.trim() || null,
            img: uploadedImageUrl,
          });

        if (error) throw error;

        toast.success("Team member added successfully");

        resetForm();
        fetchData();

        return;
      }

      // ==========================
      // EDIT MEMBER
      // ==========================

      const { error } = await supabase
        .from("PYTHA_team")
        .update({
          fullname: fullname.trim(),
          bio: bio.trim() || null,
          img: uploadedImageUrl,
        })
        .eq("id", editingTeam.id);

      if (error) throw error;

      // ==========================
      // DELETE OLD IMAGE
      // ==========================

      if (image && editingTeam.img) {
        const oldPath = getStoragePath(editingTeam.img);

        if (oldPath) {
          await supabase.storage
            .from(BUCKET)
            .remove([oldPath]);
        }
      }

      toast.success("Team member updated successfully");

      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // DELETE TEAM MEMBER
  // ==============================

  const handleDelete = async (member) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete team member?",
      text: `Are you sure you want to delete ${member.fullname}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    setDeleting(member.id);

    try {
      // Delete database record
      const { error } = await supabase
        .from("PYTHA_team")
        .delete()
        .eq("id", member.id);

      if (error) throw error;

      // Delete image from storage
      if (member.img) {
        const imagePath = getStoragePath(member.img);

        if (imagePath) {
          const { error: storageError } = await supabase.storage
            .from(BUCKET)
            .remove([imagePath]);

          if (storageError) {
            console.log(
              "Image deletion error:",
              storageError.message
            );
          }
        }
      }

      toast.success("Team member deleted");

      setTeam((prev) =>
        prev.filter((item) => item.id !== member.id)
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(null);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredTeam = team.filter((member) =>
    member.fullname
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==============================
  // FETCH WHEN ADMIN EXISTS
  // ==============================

  useEffect(() => {
    if (admin) {
      fetchData();
    }
  }, [admin]);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
        >
          <path
            d="M0 0h24v24H0z"
            fill="none"
          />

          <g>
            <circle
              cx="12"
              cy="2.5"
              r="1.5"
              fill="currentColor"
              opacity=".14"
            />

            <circle
              cx="16.75"
              cy="3.77"
              r="1.5"
              fill="currentColor"
              opacity=".29"
            />

            <circle
              cx="20.23"
              cy="7.25"
              r="1.5"
              fill="currentColor"
              opacity=".43"
            />

            <circle
              cx="21.5"
              cy="12"
              r="1.5"
              fill="currentColor"
              opacity=".57"
            />

            <circle
              cx="20.23"
              cy="16.75"
              r="1.5"
              fill="currentColor"
              opacity=".71"
            />

            <circle
              cx="16.75"
              cy="20.23"
              r="1.5"
              fill="currentColor"
              opacity=".86"
            />

            <circle
              cx="12"
              cy="21.5"
              r="1.5"
              fill="currentColor"
            />

            <animateTransform
              attributeName="transform"
              calcMode="discrete"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
            />
          </g>
        </svg>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-xl font-bold">
            Team
          </h2>

          <p className="text-sm text-gray-500">
            Manage the team members displayed on your website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 bg-black text-white rounded-lg hover:opacity-90 transition"
        >
          + Add Team
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black transition"
        />
      </div>

      {/* TEAM LIST */}
      {filteredTeam.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-gray-300 rounded-xl">
          <p className="font-medium">
            {search
              ? "No team member found"
              : "No team members yet"}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {search
              ? "Try searching another name."
              : "Add your first team member."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="border border-gray-200 rounded-xl p-4 flex gap-4"
            >

              {/* IMAGE */}
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">

                {member.img ? (
                  <img
                    src={member.img}
                    alt={member.fullname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}

              </div>

              {/* DETAILS */}
              <div className="flex-1 min-w-0">

                <h3 className="font-semibold text-lg truncate">
                  {member.fullname}
                </h3>

                <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                  {member.bio || "No bio added."}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">

                  <button
                    type="button"
                    onClick={() => handleEdit(member)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(member)}
                    disabled={deleting === member.id}
                    className="px-3 py-1.5 text-sm text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {deleting === member.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ============================== */}
      {/* ADD / EDIT MODAL */}
      {/* ============================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-6">

              <div>
                <h3 className="text-lg font-bold">
                  {editingTeam
                    ? "Edit Team Member"
                    : "Add Team Member"}
                </h3>

                <p className="text-sm text-gray-500">
                  {editingTeam
                    ? "Update team member information."
                    : "Add a new member to your website."}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* IMAGE */}
              <div className="mb-5">

                <label className="block text-sm font-medium mb-2">
                  Profile Image
                  {!editingTeam && (
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  )}
                </label>

                <div className="flex items-center gap-4">

                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">

                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}

                  </div>

                  <div>

                    <label className="cursor-pointer inline-block px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm">

                      {editingTeam
                        ? "Change Image"
                        : "Choose Image"}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                    </label>

                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG, WEBP · Max 2MB
                    </p>

                  </div>

                </div>

              </div>

              {/* FULL NAME */}
              <div className="mb-5">

                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullname}
                  onChange={(e) =>
                    setFullname(e.target.value)
                  }
                  placeholder="Enter full name"
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black transition disabled:bg-gray-100"
                />

              </div>

              {/* BIO */}
              <div className="mb-6">

                <label className="block text-sm font-medium mb-2">
                  Bio
                </label>

                <textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value)
                  }
                  placeholder="Enter a short bio..."
                  rows={4}
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black transition resize-none disabled:bg-gray-100"
                />

              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-black text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving
                    ? editingTeam
                      ? "Updating..."
                      : "Adding..."
                    : editingTeam
                    ? "Update"
                    : "Add Team"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};