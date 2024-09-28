import { useState } from "react"
import { loginApi } from "../services/operations/AuthenticationAPI";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useAuth();
  const navigate =useNavigate();

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response: any = await loginApi(username, password);

    if (response.success === true) {
      login({ userId: response.data.userId, username: username, token: response.data.token });
      navigate("/chat");
      alert(response.message);
    } else {
      alert(response.message);
    }

  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Enter Username" onChange={(e) => {
          setUsername(e.target.value)
        }} />
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Enter Password" onChange={(e) => {
          setPassword(e.target.value)
        }} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
