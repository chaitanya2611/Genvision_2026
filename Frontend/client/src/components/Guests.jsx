import { useEffect, useState } from "react";
import API from "../api";

export default function Guests() {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    API.get("/guests")
      .then((res) => setGuests(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🎤 Special Guests
      </h1>

      {guests.length === 0 ? (
        <p className="text-center text-gray-500">No guests added yet...</p>
      ) : (
        <div className="row g-4">
        {guests.map((c) => (
          <div key={c._id} className="col-md-6 col-lg-3" style={{width:"400px"}}>
            <div className="bg-white shadow p-4 rounded border border-gray-200">
              {c.image && (
              <img
  src={`http://localhost:5000${c.image}`}
  alt={c.name}
  className="card-img-top img-fluid "
  // style={{height: "500px"}}
/>
              )}
              {/* <h4 className="text-lg fw-semibold">{c.name}</h4>
              <p className="text-muted">{c.designation}</p>
              <p className="text-muted">{c.description}</p>
              <p className="text-muted small mt-1">{c.contact}</p> */}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
