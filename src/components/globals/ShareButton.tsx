import { useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { useLocation } from "react-router-dom";

interface buttonProps {
  id: string;
}

function ShareButton({ id }: buttonProps) {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    const fullUrl = window.location.origin + "#" + location.pathname;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div id={id}>
      {showPopup && (
        <div
          style={{
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
          Link copied!
        </div>
      )}
      <CiShare1 onClick={handleClick} />
    </div>
  );
}
export default ShareButton;
