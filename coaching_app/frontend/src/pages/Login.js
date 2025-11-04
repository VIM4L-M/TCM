// import React, { useState } from "react";
// import "./Login.css";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const response = await fetch("http://127.0.0.1:8000/api/login/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       setMessage("✅ Login successful!");
//       localStorage.setItem("token", data.token);
//       setTimeout(() => (window.location.href = "/"), 1000);
//     } else {
//       setMessage("❌ Invalid credentials, please try again.");
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <img
//           src="/logo192.png"
//           alt="Logo"
//           className="login-logo"
//         />
//         <h2 className="login-title">Coaching Portal Login</h2>
//         <form onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="login-input"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="login-input"
//             required
//           />
//           <button type="submit" className="login-button">
//             Login
//           </button>
//         </form>
//         {message && <p className="login-message">{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default Login;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@tcm.com" && password === "admin123") {
      setMessage("✅ Login successful!");

      // store authentication token
      localStorage.setItem("token", "admin-auth");

      // navigate to dashboard after a short delay
      navigate("/dashboard" , { replace: true } );
    } else {
      setMessage("❌ Invalid email or password!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/logo192.png" alt="Logo" className="login-logo" />
        <h2 className="login-title">Coaching Portal Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <button
          type="button"
          className="forgot-password"
          onClick={() => alert("Password reset feature coming soon!")}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Login;
