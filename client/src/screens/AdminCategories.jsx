import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminCategories() {
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

  // State for categories list
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for form
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // ✅ Fetch categories
  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
    setFormError('');
    setFormSuccess('');
  };

  // Populate form for editing
  const handleEdit = (category) => {
    setEditMode(true);
    setEditId(category.id);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
    setFormError('');
    setFormSuccess('');
  };

  // Handle form submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    const url = editMode ? `/api/categories/${editId}` : '/api/categories';
    const method = editMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`
      },
      body: JSON.stringify(formData)
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
          ? `✅ Category "${formData.name}" updated successfully!` 
          : `✅ Category "${formData.name}" created successfully!`;
        setFormSuccess(msg);
        resetForm();
        fetchCategories();
        setFormLoading(false);
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        setFormError(err.message);
        setFormLoading(false);
      });
  };

  // Delete category
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userInfo.token}` }
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          if (!res.ok) throw new Error(json.message || 'Delete failed');
          return json;
        } catch (e) {
          throw new Error('Server error');
        }
      })
      .then(() => {
        alert('✅ Category deleted!');
        fetchCategories();
      })
      .catch(err => alert(`❌ Error: ${err.message}`));
  };

  // Show loading state
  if (loading) {
    return <div style={styles.loading}>⏳ Loading categories...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📁 Manage Categories ({categories.length})</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.toggleButton}>
          {showForm ? '❌ Close Form' : '➕ Add New Category'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>{editMode ? '✏️ Edit Category' : '➕ Add New Category'}</h2>
          {formError && <div style={styles.error}>{formError}</div>}
          {formSuccess && <div style={styles.success}>{formSuccess}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="e.g., Electronics"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Brief description of the category..."
                  rows="3"
                />
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
                {formLoading ? 'Saving...' : (editMode ? '✏️ Update Category' : '🚀 Create Category')}
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

      {/* Categories Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.tableTitle}>All Categories ({categories.length})</h2>
        {categories.length === 0 ? (
          <p style={styles.emptyMessage}>No categories found. Add your first category above!</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id} style={styles.tableRow}>
                    <td style={styles.td}>#{category.id}</td>
                    <td style={styles.td}>
                      <strong>{category.name}</strong>
                    </td>
                    <td style={styles.td}>{category.description || '-'}</td>
                    <td style={styles.td}>
                      {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(category)} style={styles.editButton}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(category.id)} style={styles.deleteButton}>
                        🗑️ Delete
                      </button>
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

// ===================== STYLES =====================
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '30px',
    borderBottom: '2px solid #f0c14b',
    paddingBottom: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  toggleButton: {
    padding: '10px 20px',
    backgroundColor: '#f0c14b',
    border: '1px solid #a88734',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginTop: 0,
    marginBottom: '16px',
    color: '#1a1a2e',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    marginBottom: '4px',
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  error: {
    padding: '10px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  success: {
    padding: '10px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflowX: 'auto',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginTop: 0,
    marginBottom: '16px',
    color: '#1a1a2e',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'middle',
  },
  tableRow: {
    transition: 'background 0.2s',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '6px',
    transition: 'background 0.2s',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background 0.2s',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
};

// Hover effects via CSS injection
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .admin-toggle-btn:hover {
    background-color: #dba935 !important;
  }
  .admin-submit-btn:hover {
    background-color: #218838 !important;
  }
  .admin-edit-btn:hover {
    background-color: #e0a800 !important;
  }
  .admin-delete-btn:hover {
    background-color: #c82333 !important;
  }
  .admin-table-row:hover {
    background-color: #f8f9fa !important;
  }
  .admin-input:focus, .admin-textarea:focus {
    border-color: #f0c14b !important;
    box-shadow: 0 0 0 3px rgba(240, 193, 75, 0.2) !important;
  }
`;
document.head.appendChild(styleSheet);

export default AdminCategories;