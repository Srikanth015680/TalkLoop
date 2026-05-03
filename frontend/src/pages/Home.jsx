import React from 'react'
import { useSelector } from 'react-redux'
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer"
import Sidebar from '../components/Sidebar'; 

const Home = () => {
  const { selectedUser } = useSelector((state) => state.chat);

  return (
    <div className="h-screen pt-16 flex bg-green-50">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Chat Area */}
      <div className="flex-1 flex">
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>

    </div>
  );
};

export default Home;