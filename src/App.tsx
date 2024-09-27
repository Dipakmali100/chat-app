import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const userId=1;
  const socket = io("http://localhost:5000",{
    query:{
      userId: userId
    }
  });

  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("Connected to server, ID: " + socket.id);
    });

    socket.on("welcome",(data)=>{
      console.log(data);
    })
  },[]);
  return (
    <>
      <div className='flex justify-center'>
        <div className='border-black border-2 w-1/4 text-center bg-blue-300'>
          Real-Time Chat Application
        </div>
      </div>
    </>
  )
}

export default App;