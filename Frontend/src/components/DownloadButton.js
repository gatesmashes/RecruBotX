import React from "react";

const DownloadButton = () => {
  return (
    <button
      onClick={() => window.print()}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
    >
      Download Resume
    </button>
  );
};

export default DownloadButton;
