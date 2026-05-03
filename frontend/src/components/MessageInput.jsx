import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getSocket } from '../lib/socket'
import { Image, Send, X } from 'lucide-react'
import { sendMessage } from '../store/slice/chatSlice'
const MessageInput = () => {
  const [text, setText] = useState("")
  const [mediaPreview, setMediaPreview] = useState(null)
  const [media, setMedia] = useState(null)
  const [mediaType, setmediaType] = useState("")

  const fileInputRef = useRef(null)
  const dispatch = useDispatch()
  const { selectedUser } = useSelector((state) => state.chat)

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setMedia(file)
    const type = file.type

    if (type.startsWith("image/")) {
      setmediaType('image')
      const reader = new FileReader()
      reader.onload = () => setMediaPreview(reader.result)
      reader.readAsDataURL(file)

    } else if (type.startsWith("video/")) {
      setmediaType("video")
      const videoUrl = URL.createObjectURL(file)
      setMediaPreview(videoUrl)

    } else {
      toast.error("Please upload an image or video file")
      setMedia(null)
      setMediaPreview(null)
      setmediaType("")
      return
    }
  }

  const removeMedia = () => {
    setMedia(null)
    setMediaPreview(null)
    setmediaType("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!text.trim() && !media) return

    const data = new FormData()
    data.append("text", text.trim())
    if (media) data.append("media", media)

    dispatch(sendMessage(data))

    setText("")
    setMedia(null)
    setMediaPreview(null)
    setmediaType("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  useEffect(() => {
    if (!selectedUser?._id) return

    const socket = getSocket()
    if (!socket) return

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        dispatch({ type: "chat/pushNewMessage", payload: newMessage })
      }
    }

    socket.on("newMessage", handleNewMessage)
    return () => socket.off("newMessage", handleNewMessage)

  }, [selectedUser])

  return (
    <>
      <div className="p-3 border-t border-green-200 bg-white">

        {/* Preview */}
        {mediaPreview && (
          <div className='mb-3'>
            <div className='relative w-fit'>

              {mediaType === "image" ? (
                <img src={mediaPreview} alt="Preview" className='w-32 rounded-md border border-green-200' />
              ) : (
                <video src={mediaPreview} controls className='w-32 rounded-md border border-green-200' />
              )}

              <button
                onClick={removeMedia}
                type='button'
                className='absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 hover:bg-green-600'
              >
                <X className='w-4 h-4' />
              </button>

            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
          
          <div className='flex items-center flex-1 gap-2'>

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder='Type a message...'
              className='flex-1 px-4 py-2 rounded-full border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400'
            />

            <input
              type="file"
              accept='image/*,video/*'
              ref={fileInputRef}
              className='hidden'
              onChange={handleMediaChange}
            />

            <button
              type='button'
              onClick={() => fileInputRef.current.click()}
              className='hidden sm:flex p-2 rounded-full hover:bg-green-100'
            >
              <Image size={20} className='text-green-600' />
            </button>

          </div>

          <button
            disabled={!text.trim() && !media}
            type='submit'
            className='bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-50'
          >
            <Send className='w-5 h-5' />
          </button>

        </form>

      </div>
    </>
  )
}

export default MessageInput