// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// function RegisterScreen() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     fetch('http://localhost:5000/api/users/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setLoading(false);
//         if (data.userId) {
//           alert('Registration successful! Please log in.');
//           navigate('/login');
//         } else {
//           setError(data.message || 'Registration failed');
//         }
//       })
//       .catch((err) => {
//         setLoading(false);
//         setError('Server error. Please try again.');
//         console.error(err);
//       });
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
//       <h2>Register</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={submitHandler}>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Full Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter name"
//             required
//             style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Email Address</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter email"
//             required
//             style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter password"
//             required
//             style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Confirm Password</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             placeholder="Confirm password"
//             required
//             style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             width: '100%',
//             padding: '10px',
//             backgroundColor: '#f0c14b',
//             border: '1px solid #a88734',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '16px'
//           }}
//         >
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//       <p style={{ marginTop: '15px' }}>
//         Already have an account? <Link to="/login">Sign In</Link>
//       </p>
//     </div>
//   );
// }

// // ✅ THIS MUST BE HERE!
// export default RegisterScreen;