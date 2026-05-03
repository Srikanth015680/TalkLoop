import React from "react";

const SidebarSkeleton = () => {
  return (
    <aside className="w-full sm:w-72 h-screen bg-green-50 border-r border-green-200 p-4">
      
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-green-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-green-200 rounded animate-pulse" />
      </div>

      {/* Filter Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-28 bg-green-200 rounded animate-pulse" />
        <div className="h-4 w-10 bg-green-200 rounded animate-pulse" />
      </div>

      {/* Users List Skeleton */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-green-200 animate-pulse" />

            {/* Text */}
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-green-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-green-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;