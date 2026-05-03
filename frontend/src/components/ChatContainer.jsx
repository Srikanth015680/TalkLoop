import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getMessages } from '../store/slice/chatSlice'
import { getSocket } from "../lib/socket"
import ChatHeader from "../components/ChatHeader"
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "../components/skeletons/MessageSkeleton"
import avatar from "../assets/avatar.png"

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useSelector((state) => state.chat)
  const { authUser } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const messagesEndRef = useRef(null)

  // fetch messages
  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id))
    }
  }, [selectedUser?._id, dispatch])

  // auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })
  }

  // socket (no changes)
  useEffect(() => {
    if (!selectedUser?._id) return;

    const socket = getSocket();
    if (!socket) return;

  }, [selectedUser?._id])

  // loading
  if (isMessagesLoading) {
    return (
      <div className='flex flex-1 flex-col overflow-auto bg-green-50'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex flex-col flex-1 h-full bg-green-50'>
      
      <ChatHeader />

      {/* messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3 flex flex-col'>

        {/* empty */}
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-green-600">
            Start conversation 👋
          </div>
        )}

        {/* messages */}
        {messages.length > 0 && messages.map((message, index) => {

          // ✅ FIXED sender check
          const isSender =
            message.senderId?.toString() === authUser?._id?.toString();

          return (
            <div
              ref={index === messages.length - 1 ? messagesEndRef : null}
              key={message._id}
              className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}
            >
              
              {/* Avatar */}
              <div className={`h-10 w-10 rounded-full overflow-hidden border border-green-300 shrink-0 ${isSender ? "order-2 ml-3" : "order-1 mr-3"}`}>
                <img
                  src={
                    isSender
                      ? authUser?.avatar?.url || avatar   // ✅ FIXED
                      : selectedUser?.avatar?.url || avatar
                  }
                  alt="avatar"
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Bubble */}
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-xl text-sm shadow-sm ${
                  isSender
                    ? "bg-green-500 text-white order-1"
                    : "bg-white border border-green-200 text-gray-800 order-2"
                }`}
              >

                {/* media */}
                {message.media && (
                  <>
                    {message.media.includes(".mp4") ||
                    message.media.includes(".webm") ||
                    message.media.includes(".mov") ? (
                      <video src={message.media} controls className='w-full rounded-md mb-2' />
                    ) : (
                      <img src={message.media} alt="" className='w-full rounded-md mb-2' />
                    )}
                  </>
                )}

                {/* text */}
                {message.text && <p>{message.text}</p>}

                {/* time */}
                <span className='block mt-1 text-xs text-gray-500'>
                  {formatMessageTime(message.createdAt)}
                </span>

              </div>

            </div>
          );
        })}
      </div>

      {/* input */}
      <MessageInput />
    </div>
  )
}

export default ChatContainer