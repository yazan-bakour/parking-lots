import './Errors.css';
import { useNavigate, useLocation } from "react-router-dom";

    
const Errors = ({status, message}) => {
  const navigate = useNavigate() 
  let location = useLocation()

  const redirectLogin = () => {
    navigate("/login", { state: { from: location }, replace: true }) 
  }
  return (
    <div className='error-container t-d-blue'>
      <p>{status}</p>
      <span>{message}</span>
      <div />
      {status === 401 && <button onClick={redirectLogin} className='b-purple t-white'> Login </button>}
    </div>
  );
};
export default Errors;