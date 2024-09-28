import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

function ChattingPage() {
  const authContext = useAuth();
  const navigate = useNavigate();

  const handleOnClick = () => {
    authContext?.logout();
    navigate("/login");
  }
  return (
    <>
      <div>
        Chatting Page
      </div>
      <button onClick={handleOnClick}>Logout</button>
    </>
  )
}

export default ChattingPage
