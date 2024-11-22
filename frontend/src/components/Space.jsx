import { useLocation } from "react-router-dom";
import CanvasGame from "./Game";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from 'react-router-dom';
import { useEffect,useRef,useState } from "react";
import {DoorOpen, MessageCircle, Share2, UsersRound,Mic,MicOff,Video,VideoOff} from "lucide-react"
import { io } from "socket.io-client";
function Space() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const spaceId = searchParams.get('spaceId');
  const { user, isAuthenticated, isLoading } = useKindeAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [chatMembers, setChatMembers] = useState([]);
  const [chat,setChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const yourStream=useRef(null);
  const [video,setVideo]=useState(true);
  const [audio,setAudio]=useState(true);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
    if(isAuthenticated && user){
      const Socket = io('http://localhost:3001');
      setSocket(Socket);
      Socket.on('connect', () => {
        console.log("Chat connected")
        Socket.emit("chatConnect",{name:user.given_name+" "+user.family_name,profile:user.picture,spaceId:spaceId})
      })
      Socket.on("chatMembers",(data)=>{
        console.log(data)
        setChatMembers(data)
      });
      if(!video){
        yourStream.current.srcObject=null;
      }
      
      navigator.mediaDevices.getUserMedia({video:video,audio:audio}).then((stream)=>{
        yourStream.current.srcObject=stream;
        yourStream.current.play();
      })
      
    }
  }, [isAuthenticated, isLoading, navigate,user,spaceId,video,audio]);
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (msg) => {
        console.log("Message received from server:", msg);
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      };
  
      socket.on("receiveMessage", handleReceiveMessage);
  
      // Cleanup listener on unmount or re-render
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  
  // Retrieve query parameters from the URL
  function switchChat(value){
    if(value){
      setChat(true)}
      else{
        setChat(!chat)
      }
  }
  const handleSendMessage = () => {
    if (message.trim() && socket) {
      const chatMessage = {
        sender: `${user.given_name} ${user.family_name}`,
        message,
        timestamp: new Date().toLocaleTimeString(),
        roomId: spaceId,
        profile:user.picture
      };
      socket.emit("sendMessage", chatMessage);
      setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
      setMessage("");
      console.log(chatMessage)
    }
  };
  return (
    <div className='flex flex-col w-screen h-screen '>
        <div  className=" w-[100%] h-[5%] bg-[#1E2031] flex justify-between items-center p-3">
           <Share2 size={24} className="text-gray-400 m-2 cursor-pointer" onClick={() => navigator.clipboard.writeText(window.location.href)} />
           <span className=" text-lg text-gray-400">New Space</span>
           <span className="text-sm text-gray-300">{`Space ID ${spaceId}`}</span>
        </div>
        <div className=" h-[92%] w-screen flex  ">
           <div className=" w-[75%] bg-yellow-300">
               <CanvasGame name={user.given_name+" "+user.family_name} gameId={spaceId}  />
           </div>
           <div className=" w-[25%] bg-[#202540] ">
            {chat?(
            <div className="flex flex-col h-full">
             <div className=" w-[95%] justify-between items-center flex">
              <span className=" p-3 text-xl text-gray-400 font-bold">Chat</span>
              <span onClick={()=>{switchChat()}} className=" text-lg text-gray-300 cursor-pointer">X</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <img
                      src={msg.profile}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-300">
                          {msg.sender}
                        </span>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{msg.message}</p>
                    </div>
                  </div>
                ))}
                 </div>
              <div className="p-4 bg-[#1E2031] flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-gray-800 text-gray-300 p-2 rounded-lg"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                >
                  Send
                </button>
                
                </div>
             </div>):<div>
             <div className=" w-[95%] justify-start items-center flex">
              <span className=" p-3 text-xl text-gray-400 font-bold">Memebers</span>
              <div className=" bg-[#2D335A] rounded-lg p-1 text-gray-500 text-sm">
                {chatMembers.length}
                </div>
              <span onClick={()=>{switchChat()}} className=" text-lg text-gray-300 cursor-pointer ml-[57%]">X</span>

             </div>
                <div className=" flex flex-col overflow-y-auto">
                  {chatMembers.map((member,index)=>(
                    <div key={index} className=" flex items-center p-2">
                      <img src="/front (2).png" className=" w-11 h-11 rounded-full" />
                      <div className=" rounded-full bg-green-500 w-2 h-2"></div>
                      <span className=" text-gray-400 text-sm ml-4 font-semibold">{member.name}</span>
                      
                    </div>
                  ))}
                  </div>
               </div>
             }
           </div>
        </div>
        <div className=" w-screen h-[6%] bg-[#202540] flex items-center">
        <img 
            src="https://cdn-icons-png.flaticon.com/512/3054/3054881.png"
            alt=" Logo"
            className="w-8 h-8"
          />
        <div className=" ml-[3%] h-[80%] flex  bg-[#2D335A] space-x-2 rounded-lg items-center justify-center  ">
            <video muted ref={yourStream} className=" w-14 h-8 " >
            </video>
            <span className=" text-sm text-gray-600">|</span>
            <span className=" text-gray-400 text-sm" >{user.given_name+" "+user.family_name} </span>
            <div className=" rounded-full bg-green-500 w-2 h-2"></div>
            {audio?<Mic size={20} className="text-gray-300 m-2 cursor-pointer" onClick={()=>{setAudio(false)}} />:<MicOff size={20} className=" bg-red-500 text-gray-300 m-2 cursor-pointer" onClick={()=>{setAudio(true)}} />}
            {video?<Video size={20} className="text-gray-300 m-2 cursor-pointer mr-2" onClick={()=>{setVideo(false)}} />:<VideoOff size={20} className="mr-2 bg-red-500 text-gray-300 m-2 cursor-pointer" onClick={()=>{setVideo(true)}} />}
        </div>
          <MessageCircle onClick={()=>{switchChat(true)}} size={20} className="text-gray-300 m-2 cursor-pointer ml-[65%]" />
          <div className=" flex justify-center items-center ml-4">
          <UsersRound onClick={()=>{switchChat(false)}} size={20} className="text-gray-300 m-2 cursor-pointer" />
          <div className=" rounded-full bg-green-500 w-2 h-2 "></div>
          <span className=" text-gray-400 text-sm ml-1" >{chatMembers.length}</span>
          </div>
          <DoorOpen size={23} className="text-gray-300 m-2 cursor-pointer ml-9" />
        </div>
    </div>
  );
}

export default Space;