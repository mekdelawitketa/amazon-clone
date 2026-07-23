// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function AdminScreen() {
//   const navigate = useNavigate();
//   const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//   // State for products list
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // State for the "Add Product" form
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     image: '',
//     description: '',
//     category: '',
//     countInStock: ''
//   });
//   const [formLoading, setFormLoading] = useState(false);
//   const [formError, setFormError] = useState('');
//   const [formSuccess, setFormSuccess] = useState('');

//   // Check if user is admin
//   useEffect(() => {
//     if (!userInfo) {
//       navigate('/login');
//       return;
//     }
//     // We'll check admin status via the API
//     // For now, we'll allow access and let the API handle authorization
//   }, [userInfo, navigate]);

//   // Fetch products
//   const fetchProducts = () => {
//     setLoading(true);
//     fetch('/api/products')
//       .then(res => res.json())
//       .then(data => {
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error fetching products:', err);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle form submit (Create Product)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setFormLoading(true);
//     setFormError('');
//     setFormSuccess('');

//     const productData = {
//       name: formData.name,
//       price: parseFloat(formData.price),
//       image: formData.image,
//       description: formData.description,
//       category: formData.category,
//       countInStock: parseInt(formData.countInStock) || 0
//     };

//     fetch('/api/products', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${userInfo.token}`
//       },
//       body: JSON.stringify(productData)
//     })
//       .then(res => {
//         if (!res.ok) {
//           return res.json().then(data => {
//             throw new Error(data.message || 'Failed to create product');
//           });
//         }
//         return res.json();
//       })
//       .then(data => {
//         setFormSuccess(`✅ Product "${formData.name}" created successfully! (ID: ${data.productId})`);
//         setFormData({
//           name: '',
//           price: '',
//           image: '',
//           description: '',
//           category: '',
//           countInStock: ''
//         });
//         setShowForm(false);
//         fetchProducts(); // Refresh the list
//         setFormLoading(false);
//       })
//       .catch(err => {
//         setFormError(err.message);
//         setFormLoading(false);
//       });
//   };

//   // Delete product
//   const handleDelete = (id) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) return;

//     fetch(`/api/products/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${userInfo.token}`
//       }
//     })
//       .then(res => {
//         if (!res.ok) {
//           throw new Error('Failed to delete product');
//         }
//         return res.json();
//       })
//       .then(() => {
//         alert('✅ Product deleted!');
//         fetchProducts();
//       })
//       .catch(err => {
//         alert(`❌ Error: ${err.message}`);
//       });
//   };

//   // Loading state
//   if (loading) {
//     return <div style={styles.loading}>Loading products...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>🛠️ Admin Dashboard</h1>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           style={styles.toggleButton}
//         >
//           {showForm ? '❌ Close Form' : '➕ Add New Product'}
//         </button>
//       </div>

//       {/* Add Product Form */}
//       {showForm && (
//         <div style={styles.formContainer}>
//           <h2 style={styles.formTitle}>Add New Product</h2>
//           {formError && <div style={styles.error}>{formError}</div>}
//           {formSuccess && <div style={styles.success}>{formSuccess}</div>}
//           <form onSubmit={handleSubmit} style={styles.form}>
//             <div style={styles.formGrid}>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Product Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   style={styles.input}
//                   placeholder="e.g., Samsung Galaxy S25"
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Price *</label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   required
//                   min="0.01"
//                   step="0.01"
//                   style={styles.input}
//                   placeholder="e.g., 999.99"
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Image URL *</label>
//                 <input
//                   type="text"
//                   name="image"
//                   value={formData.image}
//                   onChange={handleInputChange}
//                   required
//                   style={styles.input}
//                   placeholder="https://images.unsplash.com/photo-..."
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Category *</label>
//                 <input
//                   type="text"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   required
//                   style={styles.input}
//                   placeholder="e.g., Electronics, Clothing, Books"
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Description *</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                   style={styles.textarea}
//                   placeholder="Product description..."
//                   rows="3"
//                 />
//               </div>
//               <div style={styles.formGroup}>
//                 <label style={styles.label}>Stock Quantity *</label>
//                 <input
//                   type="number"
//                   name="countInStock"
//                   value={formData.countInStock}
//                   onChange={handleInputChange}
//                   required
//                   min="0"
//                   style={styles.input}
//                   placeholder="e.g., 10"
//                 />
//               </div>
//             </div>
//             <button
//               type="submit"
//               disabled={formLoading}
//               style={{
//                 ...styles.submitButton,
//                 ...(formLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {})
//               }}
//             >
//               {formLoading ? 'Creating...' : '🚀 Create Product'}
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Products Table */}
//       <div style={styles.tableContainer}>
//         <h2 style={styles.tableTitle}>Product Inventory ({products.length})</h2>
//         {products.length === 0 ? (
//           <p style={styles.emptyMessage}>No products found. Add your first product above!</p>
//         ) : (
//           <div style={styles.tableWrapper}>
//             <table style={styles.table}>
//               <thead>
//                 <tr style={styles.tableHeader}>
//                   <th style={styles.th}>ID</th>
//                   <th style={styles.th}>Image</th>
//                   <th style={styles.th}>Name</th>
//                   <th style={styles.th}>Price</th>
//                   <th style={styles.th}>Stock</th>
//                   <th style={styles.th}>Category</th>
//                   <th style={styles.th}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map(product => (
//                   <tr key={product.id} style={styles.tableRow}>
//                     <td style={styles.td}>{product.id}</td>
//                     <td style={styles.td}>
//                       <img src={product.image} alt={product.name} style={styles.tableImage} />
//                     </td>
//                     <td style={styles.td}>{product.name}</td>
//                     <td style={styles.td}>${product.price}</td>
//                     <td style={styles.td}>{product.countInStock}</td>
//                     <td style={styles.td}>{product.category}</td>
//                     <td style={styles.td}>
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         style={styles.deleteButton}
//                       >
//                         🗑️ Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ===================== STYLES =====================
// const styles = {
//   container: {
//     padding: '20px',
//     maxWidth: '1200px',
//     margin: '0 auto',
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     marginBottom: '30px',
//     borderBottom: '2px solid #f0c14b',
//     paddingBottom: '15px',
//   },
//   title: {
//     fontSize: '28px',
//     fontWeight: '700',
//     color: '#1a1a2e',
//     margin: 0,
//   },
//   toggleButton: {
//     padding: '10px 20px',
//     backgroundColor: '#f0c14b',
//     border: '1px solid #a88734',
//     borderRadius: '8px',
//     fontSize: '16px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'background 0.2s',
//   },
//   formContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: '12px',
//     padding: '24px',
//     marginBottom: '30px',
//     boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
//     border: '1px solid #e0e0e0',
//   },
//   formTitle: {
//     fontSize: '20px',
//     fontWeight: '600',
//     marginTop: 0,
//     marginBottom: '16px',
//     color: '#1a1a2e',
//   },
//   form: {
//     width: '100%',
//   },
//   formGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '16px',
//   },
//   formGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   label: {
//     fontWeight: '600',
//     marginBottom: '4px',
//     fontSize: '14px',
//     color: '#333',
//   },
//   input: {
//     padding: '10px',
//     border: '1px solid #ccc',
//     borderRadius: '6px',
//     fontSize: '14px',
//     outline: 'none',
//     transition: 'border-color 0.2s',
//   },
//   textarea: {
//     padding: '10px',
//     border: '1px solid #ccc',
//     borderRadius: '6px',
//     fontSize: '14px',
//     outline: 'none',
//     fontFamily: 'inherit',
//     resize: 'vertical',
//     transition: 'border-color 0.2s',
//   },
//   submitButton: {
//     padding: '12px 24px',
//     backgroundColor: '#28a745',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '16px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     marginTop: '16px',
//     transition: 'background 0.2s',
//   },
//   error: {
//     padding: '10px',
//     backgroundColor: '#ffebee',
//     color: '#c62828',
//     borderRadius: '6px',
//     marginBottom: '12px',
//   },
//   success: {
//     padding: '10px',
//     backgroundColor: '#e8f5e9',
//     color: '#2e7d32',
//     borderRadius: '6px',
//     marginBottom: '12px',
//   },
//   tableContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: '12px',
//     padding: '20px',
//     boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
//     overflowX: 'auto',
//   },
//   tableTitle: {
//     fontSize: '18px',
//     fontWeight: '600',
//     marginTop: 0,
//     marginBottom: '16px',
//     color: '#1a1a2e',
//   },
//   tableWrapper: {
//     overflowX: 'auto',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//     fontSize: '14px',
//   },
//   tableHeader: {
//     backgroundColor: '#f5f5f5',
//   },
//   th: {
//     padding: '12px',
//     textAlign: 'left',
//     fontWeight: '600',
//     color: '#333',
//     borderBottom: '2px solid #ddd',
//   },
//   td: {
//     padding: '12px',
//     borderBottom: '1px solid #eee',
//     verticalAlign: 'middle',
//   },
//   tableRow: {
//     transition: 'background 0.2s',
//   },
//   tableImage: {
//     width: '50px',
//     height: '50px',
//     objectFit: 'cover',
//     borderRadius: '4px',
//   },
//   deleteButton: {
//     padding: '6px 12px',
//     backgroundColor: '#dc3545',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '12px',
//     transition: 'background 0.2s',
//   },
//   loading: {
//     textAlign: 'center',
//     padding: '40px',
//     fontSize: '18px',
//     color: '#666',
//   },
//   emptyMessage: {
//     textAlign: 'center',
//     padding: '20px',
//     color: '#666',
//   },
// };

// // Add hover effects
// const styleSheet = document.createElement('style');
// styleSheet.textContent = `
//   .admin-toggle-btn:hover {
//     background-color: #dba935 !important;
//   }
//   .admin-submit-btn:hover {
//     background-color: #218838 !important;
//   }
//   .admin-delete-btn:hover {
//     background-color: #c82333 !important;
//   }
//   .admin-table-row:hover {
//     background-color: #f8f9fa !important;
//   }
//   .admin-input:focus, .admin-textarea:focus {
//     border-color: #f0c14b !important;
//     box-shadow: 0 0 0 3px rgba(240, 193, 75, 0.2) !important;
//   }
// `;
// document.head.appendChild(styleSheet);

// export default AdminScreen;