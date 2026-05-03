import React from 'react'
import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from "../store/slice/chatSlice";
import avatar from "../assets/avatar.png"

const ChatHeader = () => {
  const { selectedUser } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!selectedUser) return null;

  return (
    <div className="border-b border-green-200 bg-white p-4">
      
      <div className="flex items-center justify-between">
        
        {/* user Info */}
        <div className='flex items-center gap-3'>
          
          {/* avatar */}
          <div className="relative">
            <img
              src={selectedUser?.avatar?.url || avatar}
              alt="avatar"
              className='w-10 h-10 rounded-full object-cover border border-green-300'
            />

            {onlineUsers.includes(selectedUser._id) && (
              <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'/>
            )}
          </div>

          {/* user Name and status */}
          <div>
            <h3 className='font-semibold text-gray-800'>
              {selectedUser?.fullName}
            </h3>
            <p className='text-xs text-green-600'>
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>

        </div>

        {/* close button */}
        <button
          onClick={() => dispatch(setSelectedUser(null))}
          className='p-2 rounded-full hover:bg-green-100 transition'
        >
          <X className='w-5 h-5 text-green-600' />
        </button>

      </div>

    </div>
  )
}

export default ChatHeader




















































































