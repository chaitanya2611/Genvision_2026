import { useEffect, useState } from "react";
import API from "../api";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">🎪 GenVision Events</h1>
      <div className="row g-4">
        {events.map((c) => (
          <div key={c._id} className="col-md-6 col-lg-3">
            <div className="bg-white shadow p-4 rounded border border-gray-200">
              {c.image && (
              <img
  src={`https://genvision-2026-1.onrender.com${c.image}`}
  alt={c.name}
  className="card-img-top img-fluid "
  // style={{height: "500px"}}
/>
              )}
              {/* <h4 className="text-lg fw-semibold">{c.name}</h4>
              <p className="text-muted">{c.designation}</p>
              <p className="text-muted small mt-1">{c.contact}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}