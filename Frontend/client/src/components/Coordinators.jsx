import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import API from "../api"; // axios instance

export default function Coordinators() {
  const [coordinators, setCoordinators] = useState([]);

  // 🔄 Fetch coordinators on mount
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await API.get("/coordinators");
        setCoordinators(res.data);
      } catch (err) {
        console.error("Error fetching coordinators:", err);
      }
    };
    fetchCoordinators();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold text-primary">
        Meet Our Coordinators 👥
      </h2>

      {/* Coordinator Cards */}
      <div className="row g-4">
        {coordinators.map((c) => (
          <div key={c._id} className="col-md-6 col-lg-3">
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
              <p className="text-muted small mt-1">{c.contact}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

