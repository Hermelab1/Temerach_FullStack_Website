import React from "react";
import { useLocation } from "react-router-dom";

const CyberConfirm = () => {
  const query = new URLSearchParams(useLocation().search);

  const decision = query.get("decision");

  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold">Payment Result</h2>

      {decision === "ACCEPT" ? (
        <h3 className="text-green-600 text-xl mt-4">Payment Success ✅</h3>
      ) : (
        <h3 className="text-red-600 text-xl mt-4">Payment Failed ❌</h3>
      )}
    </div>
  );
};

export default CyberConfirm;