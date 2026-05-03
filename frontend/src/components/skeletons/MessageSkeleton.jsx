import React from "react";

const MessageSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-green-50">
      
      {[...Array(6)].map((_, i) => {
        const isLeft = i % 2 === 0;

        return (
          <div
            key={i}
            className={`flex items-end ${
              isLeft ? "justify-start" : "justify-end"
            }`}
          >
            
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-green-200 animate-pulse shrink-0" />

            {/* Bubble */}
            <div
              className={`mx-3 h-10 w-40 rounded-xl animate-pulse ${
                isLeft
                  ? "bg-white border border-green-200"
                  : "bg-green-300"
              }`}
            />
          </div>
        );
      })}
      
    </div>
  );
};

export default MessageSkeleton;