import React from "react";

const LoadingSpinner = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="spinner-border text-primary">
        <span className="sr-only"></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;