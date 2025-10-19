import { useEffect, useState } from "react";
import API from "../../api";

export default function EditAbout() {
  const [form, setForm] = useState({
    poster: "",
    description: "",
    gallery: [],
    schedule: [{ date: "", event: "", time: "" }],
    sponsors: [{ name: "", logo: "", file: null, logoPreview: "" }],
  });

  const [posterFile, setPosterFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // Fetch existing About page data
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await API.get("/about");
        // Map sponsors to include file and preview
        const sponsorsWithPreview = res.data.sponsors.map((s) => ({
          ...s,
          file: null,
          logoPreview: s.logo ? `https://genvision-2026-1.onrender.com${s.logo}` : "",
        }));
        setForm({ ...res.data, sponsors: sponsorsWithPreview });
      } catch (err) {
        console.error("Error fetching about:", err);
      }
    };
    fetchAbout();
  }, []);

  // Handle simple input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Schedule Handlers
  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...form.schedule];
    newSchedule[index][field] = value;
    setForm({ ...form, schedule: newSchedule });
  };

  const addSchedule = () =>
    setForm({
      ...form,
      schedule: [...form.schedule, { date: "", event: "", time: "" }],
    });

  const removeSchedule = (index) => {
    const newSchedule = form.schedule.filter((_, i) => i !== index);
    setForm({ ...form, schedule: newSchedule });
  };

  // Sponsor Handlers
  const handleSponsorChange = (index, field, value) => {
    const newSponsors = [...form.sponsors];
    newSponsors[index][field] = value;
    setForm({ ...form, sponsors: newSponsors });
  };

  const handleLogoChange = (index, file) => {
    const newSponsors = [...form.sponsors];
    newSponsors[index].file = file;
    newSponsors[index].logoPreview = URL.createObjectURL(file);
    setForm({ ...form, sponsors: newSponsors });
  };

  const addSponsor = () =>
    setForm({
      ...form,
      sponsors: [...form.sponsors, { name: "", logo: "", file: null, logoPreview: "" }],
    });

  const removeSponsor = (index) => {
    const newSponsors = form.sponsors.filter((_, i) => i !== index);
    setForm({ ...form, sponsors: newSponsors });
  };

  // Gallery Handlers
  const handleAddGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...newPreviews],
    }));
  };

  const removeGalleryImage = (index) => {
    const newGallery = form.gallery.filter((_, i) => i !== index);
    setForm({ ...form, gallery: newGallery });

    const newGalleryFiles = [...galleryFiles];
    newGalleryFiles.splice(index, 1);
    setGalleryFiles(newGalleryFiles);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (posterFile) formData.append("poster", posterFile);
      galleryFiles.forEach((file) => formData.append("gallery", file));

      // Append sponsors files
      form.sponsors.forEach((s) => {
        if (s.file) formData.append("sponsorFiles", s.file);
      });

      formData.append("description", form.description);
      formData.append("schedule", JSON.stringify(form.schedule));
      formData.append(
        "sponsors",
        JSON.stringify(
          form.sponsors.map((s) => ({ name: s.name, logo: s.logo || "" }))
        )
      );

      await API.put("/about/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ About page updated successfully!");
    } catch (err) {
      console.error("Error updating about:", err);
      alert("❌ Error updating About Page");
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 fw-bold text-primary">🪩 Edit About Page</h3>
      <form onSubmit={handleSubmit}>
        {/* Poster */}
        <div className="mb-3">
          <label className="fw-semibold">Poster</label>
          <input
            type="file"
            onChange={(e) => setPosterFile(e.target.files[0])}
            className="form-control"
          />
          {form.poster && !posterFile && (
            <img
              src={`https://genvision-2026-1.onrender.com${form.poster}`}
              alt="Poster"
              className="mt-3 rounded"
              style={{ width: "300px", objectFit: "cover" }}
            />
          )}
          {posterFile && (
            <img
              src={URL.createObjectURL(posterFile)}
              alt="Poster Preview"
              className="mt-3 rounded"
              style={{ width: "300px", objectFit: "cover" }}
            />
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="fw-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="form-control"
            rows="4"
          />
        </div>

        {/* Gallery */}
        <h5 className="fw-bold">Gallery</h5>
        <div className="mb-3">
          <input
            type="file"
            multiple
            onChange={handleAddGalleryImages}
            className="form-control"
          />
        </div>
        <div className="d-flex flex-wrap gap-3 mb-4">
          {form.gallery.map((img, idx) => (
            <div key={idx} className="position-relative">
              <img
                src={img.startsWith("blob:") ? img : `https://genvision-2026-1.onrender.com${img}`}
                alt={`Gallery ${idx}`}
                className="rounded shadow-sm"
                style={{ width: "150px", height: "100px", objectFit: "cover" }}
              />
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                onClick={() => removeGalleryImage(idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <h5 className="fw-bold">Schedule</h5>
        {form.schedule.map((s, idx) => (
          <div key={idx} className="d-flex gap-2 mb-2">
            <input
              type="date"
              value={s.date}
              onChange={(e) => handleScheduleChange(idx, "date", e.target.value)}
              className="form-control"
            />
            <input
              type="text"
              placeholder="Event Name"
              value={s.event}
              onChange={(e) => handleScheduleChange(idx, "event", e.target.value)}
              className="form-control"
            />
            <input
              type="time"
              value={s.time}
              onChange={(e) => handleScheduleChange(idx, "time", e.target.value)}
              className="form-control"
            />
            <button
              type="button"
              onClick={() => removeSchedule(idx)}
              className="btn btn-danger"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSchedule}
          className="btn btn-outline-primary mb-4"
        >
          + Add Schedule
        </button>

        {/* Sponsors */}
        <h5 className="fw-bold">Sponsors</h5>
        {form.sponsors.map((s, idx) => (
          <div key={idx} className="d-flex gap-2 mb-3 align-items-center">
            <input
              type="text"
              placeholder="Sponsor Name"
              value={s.name}
              onChange={(e) => handleSponsorChange(idx, "name", e.target.value)}
              className="form-control"
            />
            <input
              type="file"
              onChange={(e) => handleLogoChange(idx, e.target.files[0])}
              className="form-control"
            />
            {s.logoPreview && (
              <img
                src={s.logoPreview}
                alt="Sponsor Preview"
                style={{ width: "100px", height: "80px", objectFit: "cover" }}
              />
            )}
            <button
              type="button"
              onClick={() => removeSponsor(idx)}
              className="btn btn-danger"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSponsor}
          className="btn btn-outline-primary mb-4"
        >
          + Add Sponsor
        </button>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-success px-5 fw-semibold">
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
