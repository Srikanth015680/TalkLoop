import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { getUsers, setSelectedUser } from "../store/slice/chatSlice";
import { Users, Menu } from "lucide-react";
import avatar from "../assets/avatar.png";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { users, selectedUser, isUserLoading } = useSelector(
    (state) => state.chat
  );

  const { onlineUsers } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden mt-20 flex items-center justify-between p-3 bg-green-100 border-b border-green-200">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="text-green-600" />
        </button>
        <span className="text-green-700 font-semibold">Chats</span>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen w-full sm:w-72
          bg-green-50 text-gray-800
          border-r border-green-200
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-green-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="text-green-600" />
            <span className="font-semibold text-lg">Contacts</span>
          </div>

          <button
            className="lg:hidden text-green-600"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Filter */}
        <div className="px-4 py-2 flex items-center justify-between text-sm">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="accent-green-500"
            />
            Online only
          </label>

          <span className="text-green-600 font-medium">
            ({onlineUsers.length})
          </span>
        </div>

        {/* Users */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 text-left transition ${
                  selectedUser?._id === user._id
                    ? "bg-green-200"
                    : "hover:bg-green-100"
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={user?.avatar?.url || avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-green-300"
                  />

                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {user.fullName}
                  </span>
                  <span className="text-xs text-green-600">
                    {onlineUsers.includes(user._id)
                      ? "Online"
                      : "Offline"}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center text-green-600 mt-4">
              No users found
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;