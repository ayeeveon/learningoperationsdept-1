import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function ScrollArrow({ direction = "right", onClick }) {
  const [hover, setHover] = useState(false);

  const baseStyle = {
    background: "transparent",
    border: "none",
    color: "#a361ef",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "2rem",
    userSelect: "none",
    padding: "0 0.5rem",
    margin: "0 0.25rem",
    transition: "color 0.3s ease, transform 0.2s ease",
    outline: "none",
  };

  const hoverStyle = {
    color: "#d4a1ff",
    transform: "scale(1.2)",
  };

  return (
    <button
      onClick={onClick}
      style={hover ? { ...baseStyle, ...hoverStyle } : baseStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
    >
      {direction === "left" ? "<" : ">"}
    </button>
  );
}

function HomePage() {
  const certScrollRef = useRef(null);
  const tesdaScrollRef = useRef(null);

  const [showCertArrows, setShowCertArrows] = useState(false);
  const [showTesdaArrows, setShowTesdaArrows] = useState(false);

  // Example data arrays - replace with real data or fetch calls
  const certificates = [
    "Certificate 1",
    "Certificate 2",
    "Certificate 3",
    "Certificate 4",
    "Certificate 5",
    "Certificate 6",
    "Certificate 7",
  ];

  const tesdaRecords = [
    "TESDA Record 1",
    "TESDA Record 2",
    "TESDA Record 3",
    "TESDA Record 4",
    "TESDA Record 5",
  ];

  // Check if scroll is needed for certificates
  useEffect(() => {
    const el = certScrollRef.current;
    if (el) setShowCertArrows(el.scrollWidth > el.clientWidth);
  }, [certificates]);

  // Check if scroll is needed for TESDA records
  useEffect(() => {
    const el = tesdaScrollRef.current;
    if (el) setShowTesdaArrows(el.scrollWidth > el.clientWidth);
  }, [tesdaRecords]);

  const scroll = (ref, direction) => {
    if (!ref.current) return;
    const scrollAmount = 200 * direction; // adjust scroll distance here
    ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Styles
  const containerStyle = {
    backgroundColor: "#696b6c",
    color: "white",
    margin: "2rem auto",
    padding: "1rem",
    width: "calc(100% - 280px)", // subtract sidebar width
    marginLeft: "280px",         // match sidebar width
    height: "fit-content",
    boxShadow: "0 5px 7px #0000004d",
    borderRadius: "6px",
  };

  const scrollContainerStyle = {
    display: "flex",
    overflowX: "auto",
    scrollBehavior: "smooth",
    scrollbarWidth: "none",  // Firefox
    msOverflowStyle: "none", // IE 10+
  };

  const hideScrollbar = {
    "&::-webkit-scrollbar": {
      display: "none", // Chrome, Safari, Opera
    }
  };

  const itemStyle = {
    flex: "0 0 auto",
    backgroundColor: "#4c3a91",
    margin: "0 0.5rem",
    padding: "1rem",
    borderRadius: "4px",
    minWidth: "150px",
    textAlign: "center",
    boxShadow: "0 3px 5px #00000066",
  };

  return (
    <>
      <Sidebar />

      <div style={containerStyle}>
        <h2>Recently Made Certificates</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          {showCertArrows && (
            <ScrollArrow direction="left" onClick={() => scroll(certScrollRef, -1)} />
          )}

          <div
            ref={certScrollRef}
            style={{ ...scrollContainerStyle, ...hideScrollbar, flexGrow: 1 }}
            className="scroll-container"
          >
            {certificates.map((cert, i) => (
              <div key={i} style={itemStyle}>
                {cert}
              </div>
            ))}
          </div>

          {showCertArrows && (
            <ScrollArrow direction="right" onClick={() => scroll(certScrollRef, 1)} />
          )}
        </div>
      </div>

      <div style={containerStyle}>
        <h2>TESDA Records</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          {showTesdaArrows && (
            <ScrollArrow direction="left" onClick={() => scroll(tesdaScrollRef, -1)} />
          )}

          <div
            ref={tesdaScrollRef}
            style={{ ...scrollContainerStyle, ...hideScrollbar, flexGrow: 1 }}
            className="scroll-container"
          >
            {tesdaRecords.map((record, i) => (
              <div key={i} style={itemStyle}>
                {record}
              </div>
            ))}
          </div>

          {showTesdaArrows && (
            <ScrollArrow direction="right" onClick={() => scroll(tesdaScrollRef, 1)} />
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
