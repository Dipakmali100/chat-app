import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import SearchUser from "../components/SearchUser";
import GetFriendList from "../components/GetFriendList";
import GetChat from "../components/GetChat";

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
        <SearchUser/>
        <GetFriendList/>
        <GetChat/>
      </div>
      <button onClick={handleOnClick}>Logout</button>
    </>
  )
}

export default ChattingPage
