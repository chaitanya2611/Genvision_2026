import { useState, useEffect } from "react";
import API from "../../api";

export default function ManageParticipants() {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null); // participant under edit

  useEffect(() => {
    fetchParticipants();
    fetchEvents();
  }, []);

  // 🧠 Fetch participants
  const fetchParticipants = async () => {
    const res = await API.get("/participants");
    setParticipants(res.data);
  };

  // 🧠 Fetch events
  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  // ✏️ Edit participant
  const handleEdit = (p) => {
    setEditing({
      ...p,
      events: p.events.map((ev) => ev._id), // populate with IDs
    });
  };

  // 💾 Save updated participant
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/participants/${editing._id}`, editing);
      alert("✅ Participant updated successfully!");
      setEditing(null);
      fetchParticipants();
    } catch (err) {
      alert("❌ Error updating participant");
    }
  };

  // ❌ Delete participant
  const handleDelete = async (id) => {
    if (window.confirm("Delete this participant?")) {
      await API.delete(`/participants/${id}`);
      alert("🗑️ Deleted successfully!");
      fetchParticipants();
    }
  };

  // 🔄 Handle form change while editing
  const handleChange = (e) => {
    setEditing({ ...editing, [e.target.name]: e.target.value });
  };

  // 🧩 Handle multi-event select in edit form
  const handleEventSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setEditing({ ...editing, events: selected });
  };

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-3">🎓 Participants List</h2>

      {/* 📋 Participants Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Event(s)</th>
              <th>Accommodation</th>
              <th>Travel</th>
              <th>Reg ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.college}</td>
                <td>{p.events.map((ev) => ev.name).join(", ")}</td>
                <td>{p.accommodation_status}</td>
                <td>{p.travel_status}</td>
                <td>{p.registration_id}</td>
                <td className="d-flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="btn btn-sm btn-outline-warning"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧾 Edit Form Modal */}
      {editing && (
        <div className="p-4 mt-4 border rounded bg-light shadow-sm">
          <h4>Edit Participant: {editing.name}</h4>
          <form onSubmit={handleUpdate} className="row g-3">
            <div className="col-md-6">
              <input
                name="name"
                value={editing.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                name="email"
                value={editing.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Email"
                required
              />
            </div>

            <div className="col-md-6">
              <select
                name="accommodation_status"
                value={editing.accommodation_status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="pending">Accommodation Pending</option>
                <option value="confirmed">Accommodation Confirmed</option>
                <option value="rejected">Accommodation Rejected</option>
              </select>
            </div>
            <div className="col-md-6">
              <select
                name="travel_status"
                value={editing.travel_status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="pending">Travel Pending</option>
                <option value="confirmed">Travel Confirmed</option>
                <option value="rejected">Travel Rejected</option>
              </select>
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Select Events</label>
              <select
                multiple
                value={editing.events}
                onChange={handleEventSelect}
                className="form-select"
              >
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center mt-3">
              <button type="submit" className="btn btn-success px-4 fw-semibold">
                💾 Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-3"
                onClick={() => setEditing(null)}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

