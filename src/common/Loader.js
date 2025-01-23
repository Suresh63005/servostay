import React from "react";
import { FadeLoader, MoonLoader, RingLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-85 z-50">
      {/* <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
        }
      `}</style> */}

<FadeLoader 
  color="#045D78"
  speedMultiplier={1}
/>
    </div>
  );
};

export default Loader;
