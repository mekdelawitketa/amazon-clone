import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminProducts() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 🔒 Security check
  if (!userInfo || !userInfo.token) {
    navigate('/login');
    return null;
  }

  // 🚨 Debug
  console.log("👤 User Info:", userInfo);
  console.log("🔑 Token:", userInfo.token);

  // ✅ State for products and categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: null,
    description: '',
    category_id: '', // ✅ Changed from 'category' to 'category_id'
    countInStock: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // ✅ Fetch both products and categories
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📸 File selected:", file.name);
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: null,
      description: '',
      category_id: '',
      countInStock: ''
    });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
    setFormError('');
    setFormSuccess('');
  };

  // Populate form for editing
  const handleEdit = (product) => {
    setEditMode(true);
    setEditId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      image: null,
      description: product.description || '',
      category_id: product.category_id || '',
      countInStock: product.countInStock
    });
    setShowForm(true);
    setFormError('');
    setFormSuccess('');
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category_id', formData.category_id); // ✅ Send category_id
    formDataToSend.append('countInStock', formData.countInStock);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    console.log("📤 Sending request with token:", userInfo.token);

    const url = editMode ? `/api/products/${editId}` : '/api/products';
    const method = editMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${userInfo.token}`
      },
      body: formDataToSend
    })
      .then(async (res) => {
        const text = await res.text();
        console.log("📥 Raw response:", text);
        try {
          const json = JSON.parse(text);
          if (!res.ok) throw new Error(json.message || 'Operation failed');
          return json;
        } catch (e) {
          throw new Error('Server returned invalid JSON. Check backend logs.');
        }
      })
      .then(() => {
        const msg = editMode 
          ? `✅ Product "${formData.name}" updated successfully!` 
          : `✅ Product "${formData.name}" created successfully!`;
        setFormSuccess(msg);
        resetForm();
        fetchData();
        setFormLoading(false);
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        setFormError(err.message);
        setFormLoading(false);
      });
  };

  // Delete product
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userInfo.token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        return res.json();
      })
      .then(() => {
        alert('✅ Product deleted!');
        fetchData();
      })
      .catch(err => alert(`❌ Error: ${err.message}`));
  };

  if (loading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Uncategorized';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 Manage Products ({products.length})</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.toggleButton}>
          {showForm ? '❌ Close Form' : '➕ Add New Product'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>{editMode ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
          {formError && <div style={styles.error}>{formError}</div>}
          {formSuccess && <div style={styles.success}>{formSuccess}</div>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Samsung Galaxy S25"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0.01"
                  step="0.01"
                  style={styles.input}
                  placeholder="e.g., 999.99"
                />
              </div>

              {/* ✅ CATEGORY DROPDOWN */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select a category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Stock Quantity *</label>
                <input
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  style={styles.input}
                  placeholder="e.g., 10"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  style={styles.textarea}
                  placeholder="Product description..."
                  rows="3"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Image {editMode ? '(leave empty to keep current)' : '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={styles.input}
                />
                {editMode && formData.image === null && (
                  <small style={{ color: '#888' }}>Current image will be kept</small>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  ...styles.submitButton,
                  ...(formLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                }}
              >
                {formLoading ? 'Saving...' : (editMode ? '✏️ Update Product' : '🚀 Create Product')}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={styles.cancelButton}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableContainer}>
        <h2 style={styles.tableTitle}>Product Inventory ({products.length})</h2>
        {products.length === 0 ? (
          <p style={styles.emptyMessage}>No products found. Add your first product above!</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={styles.tableRow}>
                    <td style={styles.td}>{product.id}</td>
                    <td style={styles.td}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.tableImage}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                      />
                    </td>
                    <td style={styles.td}>{product.name}</td>
                    <td style={styles.td}>${product.price}</td>
                    <td style={styles.td}>{product.countInStock}</td>
                    <td style={styles.td}>
                      {getCategoryName(product.category_id)}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(product)} style={styles.editButton}>✏️ Edit</button>
                      <button onClick={() => handleDelete(product.id)} style={styles.deleteButton}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '30px', borderBottom: '2px solid #f0c14b', paddingBottom: '15px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  toggleButton: { padding: '10px 20px', backgroundColor: '#f0c14b', border: '1px solid #a88734', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  formContainer: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' },
  formTitle: { fontSize: '20px', fontWeight: '600', marginTop: 0, marginBottom: '16px', color: '#1a1a2e' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontWeight: '600', marginBottom: '4px', fontSize: '14px', color: '#333' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' },
  textarea: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' },
  submitButton: { padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  cancelButton: { padding: '12px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  error: { padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', marginBottom: '12px' },
  success: { padding: '10px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '6px', marginBottom: '12px' },
  tableContainer: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflowX: 'auto' },
  tableTitle: { fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '16px', color: '#1a1a2e' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tableHeader: { backgroundColor: '#f5f5f5' },
  th: { padding: '12px', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #ddd' },
  td: { padding: '12px', borderBottom: '1px solid #eee', verticalAlign: 'middle' },
  tableRow: { transition: 'background 0.2s' },
  tableImage: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' },
  editButton: { padding: '6px 12px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
  deleteButton: { padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  loading: { textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' },
  emptyMessage: { textAlign: 'center', padding: '20px', color: '#666' },
};

export default AdminProducts;