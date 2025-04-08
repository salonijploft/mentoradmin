import React from "react";

const Loader = () => {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const spinnerStyle = {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle} />
    </div>
  );
};

export default Loader;
