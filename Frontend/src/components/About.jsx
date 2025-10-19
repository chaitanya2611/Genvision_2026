import { useState, useEffect } from "react";
import API from "../api";
import { Carousel } from "react-bootstrap";
import "../css/about.css";
import Countdown from "./CountDown";

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Fetch About Data
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await API.get("/about");
        setAbout(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAbout();
  }, []);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!about) return <p>Loading...</p>;

  const baseURL = "https://genvision-2026-1.onrender.com/api";
  const eventDate = "2026-01-18T11:59:59";

  // LazyImage Component
  const LazyImage = ({ src, alt, style, className }) => {
    const [loaded, setLoaded] = useState(false);
    const finalSrc = src.startsWith("http") ? src : baseURL + src;

    return (
      <div style={{ backgroundColor: "#e0e0e0", ...style }}>
        <img
          src={finalSrc}
          alt={alt}
          loading="lazy"
          className={className}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            display: "block",
          }}
        />
      </div>
    );
  };

  return (
    <div>
    <div className="container my-5">
      {/* Hero Section: Poster + Description */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        {!isMobile ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "30px",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              alignItems: "flex-start",
            }}
          >
            {/* Poster */}
            {about.poster && (
              <div
                style={{
                  flex: "0 0 auto",
                  maxWidth: "400px",
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={about.poster.startsWith("http") ? about.poster : baseURL + about.poster}
                  alt="Poster"
                  style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px" }}
                />
              </div>
            )}

            {/* Description */}
            <div style={{ flex: 1, minWidth: "250px", display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  fontSize: "1.5rem",
                  lineHeight: "1.8",
                  color: "#333",
                  textAlign: "justify",
                  padding: "15px 20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                  margin: 0,
                }}
              >
                {about.description}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ perspective: "1000px", maxWidth: "400px", margin: "0 auto 30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div
              onClick={() => setFlipped((prev) => !prev)}
              style={{
                width: "100%",
                height: "auto",
                cursor: "pointer",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front: Image */}
              <div style={{ backfaceVisibility: "hidden", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                <img
                  src={about.poster.startsWith("http") ? about.poster : baseURL + about.poster}
                  alt="Poster"
                  style={{ width: "100%", display: "block" }}
                />
              </div>

              {/* Back: Description */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  backgroundColor: "#f9f9f9",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <p style={{ fontSize: "1rem", lineHeight: "1.7rem", color: "#333", textAlign: "justify", margin: 0 }}>
                  {about.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Countdown Section */}
      <Countdown targetDate={eventDate} />

      {/* Events */}
      <div className="row g-4" style={{marginTop:"5%"}}>
        {events.map((c) => (
          <div key={c._id} className="col-md-6 col-lg-4">
            <div className="bg-white shadow p-4 rounded border border-gray-200">
              {c.image && (
              <img
  src={`https://genvision-2026-1.onrender.com{c.image}`}
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

      {/* Gallery */}
      {about.gallery.length > 0 && (
        <Carousel className="mb-4" interval={2000} pause="hover" style={{ borderRadius: "20px", marginTop:"10%", overflow: "hidden" }}>
          {about.gallery.map((img, idx) => (
            <Carousel.Item key={idx}>
              <LazyImage
                src={img}
                alt={`Gallery ${idx}`}
                style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "20px" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      
    </div>
          {/* Sponsors */}
      <div style={{ backgroundColor: "#fff", width: "100%", padding: 0, marginBottom: "4%" }}>
        <h3 className="mt-4 mb-2 text-center" style={{ paddingTop: "2%" }}>
          Sponsors
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center", alignItems: "center", padding: "10px 0" }}>
          {about.sponsors.map((s, idx) => (
            <div key={idx} style={{ flex: "0 0 140px", textAlign: "center" }}>
              <LazyImage
                src={s.logo}
                alt={s.name}
                style={{ borderRadius: "8px", objectFit: "contain", backgroundColor: "#f0f0f0" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
