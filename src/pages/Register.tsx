import { useState } from "react";
import { loginApi, registerApi } from "../services/operations/AuthenticationAPI";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Register(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const authContext = useAuth(); // Get the context
  const navigate = useNavigate();

  // Ensure authContext is defined
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { login } = authContext; // Destructure the login function

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length === 0 || username.length === 0) {
      alert("Please enter username and password");
      return;
    }

    const response: any = await registerApi(username, password);
    if (response.success === true) {
      const response: any = await loginApi(username, password);

      if (response.success === true) {
        login({ userId: response.data.userId, username: username, token: response.data.token });
        navigate("/chat");
        alert(response.message);
      } else {
        alert(response.message);
      }
    } else {
      alert(response.message);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Enter Username" value={username} onChange={(e) => { setUsername(e.target.value.toLowerCase()) }} /><br />
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Enter Password" onChange={(e) => {
          setPassword(e.target.value)
        }} /><br />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" placeholder="Enter Confirm Password" onChange={(e) => {
          setConfirmPassword(e.target.value)
        }} /><br />
        <button type="submit">Register</button>
      </form>

      <br />
      <button onClick={() => navigate("/login")}>Login Now</button>
    </div>
  )
}

export default Register;
