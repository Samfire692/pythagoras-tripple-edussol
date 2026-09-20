import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ImagePlus,
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

export const AdminEvent = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: null,
    active: true,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // =========================
  // FETCH EVENTS
  // =========================
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);

      const { data, error } = await supabase
        .from("PYTHA_events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to fetch events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0];

      setFormData((prev) => ({
        ...prev,
        image: file || null,
      }));

      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.error("Please select a valid image.");
          e.target.value = "";
          setFormData((prev) => ({
            ...prev,
            image: null,
          }));
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          toast.error("Image must not exceed 2MB.");
          e.target.value = "";
          setFormData((prev) => ({
            ...prev,
            image: null,
          }));
          return;
        }

        setImagePreview(URL.createObjectURL(file));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // STORAGE PATH
  // =========================
  const getStoragePath = (imageUrl) => {
    if (!imageUrl) return null;

    try {
      const marker =
        "/storage/v1/object/public/events-images/";

      if (!imageUrl.includes(marker)) {
        return null;
      }

      return decodeURIComponent(imageUrl.split(marker)[1]);
    } catch {
      return null;
    }
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: null,
      active: true,
    });

    setImagePreview(null);

    const input = document.getElementById("event-image");

    if (input) {
      input.value = "";
    }
  };

  // =========================
  // UPLOAD IMAGE
  // =========================
  const uploadImage = async (file) => {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image.");
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Image must not exceed 2MB.");
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `event-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("events-images")
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("events-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // =========================
  // ADD / UPDATE EVENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Event title is required.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Event description is required.");
      return;
    }

    if (!formData.date) {
      toast.error("Event date is required.");
      return;
    }

    try {
      setSaving(true);

      const oldEvent = editingId
        ? events.find((event) => event.id === editingId)
        : null;

      let imageUrl = oldEvent?.image || null;

      // Upload new image
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time || null,
        location: formData.location.trim(),
        image: imageUrl,
        active: formData.active,
      };

      // =========================
      // UPDATE
      // =========================
      if (editingId) {
        const { data, error } = await supabase
          .from("PYTHA_events")
          .update(eventData)
          .eq("id", editingId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Delete old image if a new image was uploaded
        if (formData.image && oldEvent?.image) {
          const oldPath = getStoragePath(oldEvent.image);

          if (oldPath) {
            const { error: storageError } =
              await supabase.storage
                .from("events-images")
                .remove([oldPath]);

            if (storageError) {
              console.error(
                "Old image deletion error:",
                storageError
              );
            }
          }
        }

        setEvents((prev) =>
          prev.map((event) =>
            event.id === editingId ? data : event
          )
        );

        toast.success("Event updated successfully.");
      }

      // =========================
      // INSERT
      // =========================
      else {
        const { data, error } = await supabase
          .from("PYTHA_events")
          .insert(eventData)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setEvents((prev) => [...prev, data]);

        toast.success("Event added successfully.");
      }

      resetForm();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          (editingId
            ? "Failed to update event."
            : "Failed to add event.")
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT EVENT
  // =========================
  const handleEdit = (event) => {
    setEditingId(event.id);

    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      image: null,
      active: event.active ?? true,
    });

    setImagePreview(event.image || null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE EVENT
  // =========================
  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Delete "${event.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(event.id);

      // Delete database record
      const { error } = await supabase
        .from("PYTHA_events")
        .delete()
        .eq("id", event.id);

      if (error) {
        throw error;
      }

      // Delete image from storage
      if (event.image) {
        const imagePath = getStoragePath(event.image);

        if (imagePath) {
          const { error: storageError } =
            await supabase.storage
              .from("events-images")
              .remove([imagePath]);

          if (storageError) {
            console.error(
              "Image deletion error:",
              storageError
            );
          }
        }
      }

      setEvents((prev) =>
        prev.filter((item) => item.id !== event.id)
      );

      if (editingId === event.id) {
        resetForm();
      }

      toast.success("Event deleted successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || "Failed to delete event."
      );
    } finally {
      setDeleting(null);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid gap-6">
      {/* =========================================
          ADD / EDIT EVENT
      ========================================= */}
      <div className="rounded-2xl border border-slate-300/60 bg-white/5 shadow-lg shadow-slate-500/10 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-300/50">
          <div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              {editingId ? "Edit Event" : "Create Event"}
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {editingId
                ? "Update the event information below."
                : "Add a new event to your platform."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300/60 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 grid gap-4"
        >
          {/* IMAGE */}
          <div className="grid md:grid-cols-[180px_1fr] gap-4">
            <div className="relative h-40 md:h-36 rounded-xl border border-dashed border-slate-400/60 overflow-hidden bg-slate-100/40 dark:bg-slate-900/30 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <ImagePlus
                    size={28}
                    className="mx-auto mb-2"
                  />

                  <span className="text-xs">
                    Event image
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <label
                htmlFor="event-image"
                className="inline-flex items-center justify-center gap-2 w-fit px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-semibold cursor-pointer hover:bg-slate-700 transition"
              >
                <ImagePlus size={17} />

                {editingId
                  ? "Replace Image"
                  : "Choose Image"}
              </label>

              <input
                id="event-image"
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleChange}
                disabled={saving}
                className="hidden"
              />

              <p className="text-xs text-slate-400 mt-2">
                JPG, PNG or WEBP · Maximum 2MB
              </p>
            </div>
          </div>

          {/* TITLE */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">
              Event Title
            </label>

            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              disabled={saving}
              placeholder="e.g. Annual General Meeting"
              className="w-full h-11 border border-slate-300/70 rounded-xl px-3 outline-none focus:border-blue-500 transition disabled:opacity-50 bg-transparent"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={saving}
              placeholder="Tell people about this event..."
              rows={4}
              className="w-full border border-slate-300/70 rounded-xl p-3 outline-none focus:border-blue-500 transition resize-none disabled:opacity-50 bg-transparent"
            />
          </div>

          {/* DATE + TIME */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* DATE */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full h-11 border border-slate-300/70 rounded-xl pl-10 pr-3 outline-none focus:border-blue-500 transition disabled:opacity-50 bg-transparent"
                />
              </div>
            </div>

            {/* TIME */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                Time
              </label>

              <div className="relative">
                <Clock3
                  size={17}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full h-11 border border-slate-300/70 rounded-xl pl-10 pr-3 outline-none focus:border-blue-500 transition disabled:opacity-50 bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">
              Location
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                disabled={saving}
                placeholder="e.g. Main Auditorium"
                className="w-full h-11 border border-slate-300/70 rounded-xl pl-10 pr-3 outline-none focus:border-blue-500 transition disabled:opacity-50 bg-transparent"
              />
            </div>
          </div>

          {/* ACTIVE */}
          <label className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-300/60">
            <div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                Event visibility
              </p>

              <p className="text-xs text-slate-400 mt-0.5">
                Make this event visible on the platform.
              </p>
            </div>

            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              disabled={saving}
              className="w-5 h-5 accent-blue-600"
            />
          </label>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              "Saving..."
            ) : editingId ? (
              <>
                <Check size={18} />
                Update Event
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Event
              </>
            )}
          </button>
        </form>
      </div>

      {/* =========================================
          ALL EVENTS
      ========================================= */}
      <div className="rounded-2xl border border-slate-300/60 bg-white/5 shadow-lg shadow-slate-500/10 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-slate-300/50">
          <div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
              All Events
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {events.length}{" "}
              {events.length === 1 ? "event" : "events"}{" "}
              created
            </p>
          </div>

          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600">
            <CalendarDays size={19} />
          </div>
        </div>

        {/* EVENTS */}
        <div className="p-4">
          {loadingEvents ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarDays
                size={40}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="font-semibold text-slate-500">
                No events yet
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Create your first event using the form above.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group rounded-xl border border-slate-300/60 overflow-hidden bg-white/5 hover:shadow-md transition"
                >
                  {/* IMAGE */}
                  <div className="relative h-44 bg-slate-100 dark:bg-slate-900/40 overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImagePlus size={35} />
                      </div>
                    )}

                    {/* STATUS */}
                    <div
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md ${
                        event.active
                          ? "bg-green-500/90 text-white"
                          : "bg-slate-700/90 text-white"
                      }`}
                    >
                      {event.active ? (
                        <>
                          <Eye size={13} />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} />
                          Hidden
                        </>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 min-h-8">
                      {event.description}
                    </p>

                    <div className="grid gap-2 mt-4 text-xs text-slate-500">
                      {/* DATE */}
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="text-blue-500"
                        />

                        {formatDate(event.date)}
                      </div>

                      {/* TIME */}
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <Clock3
                            size={15}
                            className="text-blue-500"
                          />

                          {event.time}
                        </div>
                      )}

                      {/* LOCATION */}
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={15}
                            className="text-blue-500"
                          />

                          <span className="line-clamp-1">
                            {event.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-5 pt-3 border-t border-slate-300/50">
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() => handleEdit(event)}
                        disabled={
                          saving || deleting === event.id
                        }
                        className="flex-1 h-9 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() => handleDelete(event)}
                        disabled={
                          saving || deleting === event.id
                        }
                        className="flex-1 h-9 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                      >
                        <Trash2 size={14} />

                        {deleting === event.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};