import React from "react";

const NoChatSelected = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-6 max-w-sm">
        
        {/* Icon Circle */}
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">
          💬
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No Chat Selected
        </h2>

        {/* Subtitle */}
        <p className="text-green-600 text-sm">
          Select a contact from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;