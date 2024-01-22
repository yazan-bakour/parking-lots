import { useState } from "react";
import { useAPI } from "../../api/apiContext";
import { useNavigate, useLocation } from "react-router-dom";
import './Login.css'
    
const Login = () => {
  const [email, setEmail] = useState('super@parkdemeer.nl')
  const [password, setPassword] = useState('SUPER_USER_SECRET_PASS')

  const { postUserAuth, loginUser } = useAPI();
  const navigate = useNavigate()
  let location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postUserAuth(email, password);

      if (loginUser()) {
        navigate("/overview", { state: { from: location }, replace: true });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }
  
  return (
    <div className="form card">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" onChange={e => setPassword(e.target.value)} value={password} />
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );
};
export default Login;