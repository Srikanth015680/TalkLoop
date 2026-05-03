import React from 'react';

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center min-h-screen bg-green-100 relative overflow-hidden">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20 flex items-center justify-center">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-green-300 rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          {title}
        </h2>
        <p className="text-green-700">
          {subtitle}
        </p>
      </div>

    </div>
  );
};

export default AuthImagePattern;