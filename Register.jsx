import React, { useState, useEffect } from 'react';
import './Register.css';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation for reading URL parameters
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation

  // Parse role from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleFromURL = params.get('role');
    if (roleFromURL) {
      setRole(roleFromURL);
      setIsSignUp(true); // Default to Sign Up if coming from the cards
    }
  }, [location.search]);

  // Validation checks
  const isEmailValid = email.includes("@");
  const isCnicValid = cnic.length === 13 && /^\d{13}$/.test(cnic);
  const isPasswordMatch = password === confirmPassword;

  // Toggle between Sign Up and Sign In
  const handleSignUp = () => setIsSignUp(true);
  const handleSignIn = () => setIsSignUp(false);

  // Handle input changes
  const handleInputChange = (setter) => (e) => setter(e.target.value);
  const handleCnicChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setCnic(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/login';
    const payload = isSignUp ? { name, email, cnic, password, role } : { email, password, role };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        if (isSignUp) {
          toast.success(data.message);
        } else {
          toast.success(data.message);
          const { token, user } = data;
          if (user && user._id) {
            sessionStorage.setItem("loggedInUser", user._id);
          }
          localStorage.setItem('token', token);
          navigate(`/${role}-dashboard`);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(`${isSignUp ? 'Sign Up' : 'Sign In'} Error: ${error.message}`);
    }
  };


 


  return (
    <div className="wrapper">
      <div className={`container ${isSignUp ? "active" : ""}`}>
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" value={name} onChange={handleInputChange(setName)} />
            <input type="email" placeholder="Email" value={email} onChange={handleInputChange(setEmail)} style={{ borderColor: isEmailValid ? "" : "red" }} />
            {!isEmailValid && <small style={{ color: "red" }}>Invalid email address</small>}
            <input type="text" placeholder="CNIC" value={cnic} onChange={handleCnicChange} maxLength={13} style={{ borderColor: isCnicValid ? "" : "red" }} />
            {!isCnicValid && <small style={{ color: "red" }}>CNIC must be exactly 13 digits</small>}
            <input type="password" placeholder="Password" value={password} onChange={handleInputChange(setPassword)} style={{ borderColor: isPasswordMatch ? "" : "red" }} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleInputChange(setConfirmPassword)} style={{ borderColor: isPasswordMatch ? "" : "red" }} />
            {!isPasswordMatch && <small style={{ color: "red" }}>Passwords do not match</small>}
            <div className="roles">
              {['customer','agent'].map(roleOption => (
                <label key={roleOption}>
                  <input
                    type="radio"
                    name="role"
                    value={roleOption}
                    checked={role === roleOption} // Automatically check the role from URL
                    onChange={handleInputChange(setRole)}
                  /> {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </label>
              ))}
            </div>
            <button disabled={!isEmailValid || !isCnicValid || !isPasswordMatch || !role}>Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <span>or use your email and password</span>
            <input type="email" placeholder="Email" value={email} onChange={handleInputChange(setEmail)} style={{ borderColor: isEmailValid ? "" : "red" }} />
            <input type="password" placeholder="Password" value={password} onChange={handleInputChange(setPassword)} />
            <div className="roles">
              {['customer','agent'].map(roleOption => (
                <label key={roleOption}>
                  <input
                    type="radio"
                    name="role"
                    value={roleOption}
                    checked={role === roleOption} // Automatically check the role from URL
                    onChange={handleInputChange(setRole)}
                  /> {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </label>
              ))}
            </div>
            <button>Sign In</button>
          </form>
        </div>

        {/* Toggle Panel */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left" onClick={handleSignIn}>
              <h1>Welcome Back!</h1>
              <p>To sign in, use your personal details</p>
              <button onClick={handleSignIn}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right" onClick={handleSignUp}>
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details</p>
              <button onClick={handleSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
