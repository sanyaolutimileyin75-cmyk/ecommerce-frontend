import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import './AddProduct.css';

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [priceDollars, setPriceDollars] = useState('');
  const [stars, setStars] = useState('');
  const [ratingCount, setRatingCount] = useState('');
  const [keywords, setKeywords] = useState('');
  const [categoryId, setCategoryId] = useState('');  // NEW

  // Categories list for dropdown
  const [categories, setCategories] = useState<Category[]>([]);  // NEW

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load categories on mount
  useEffect(() => {
    axios
      .get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!imageFile) {
        setError('Please select an image');
        setLoading(false);
        return;
      }

      // Step 1: Upload the image
      const formData = new FormData();
      formData.append('image', imageFile);

      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imagePath = uploadResponse.data.imagePath;

      // Step 2: Create the product (now includes categoryId)
      const newProduct = {
        name,
        image: imagePath,
        priceCents: Math.round(parseFloat(priceDollars) * 100),
        rating: {
          stars: parseFloat(stars),
          count: parseInt(ratingCount)
        },
        keywords: keywords.split(',').map(k => k.trim()),
        categoryId: categoryId || null  // send null if no category selected
      };

      await axios.post('/api/products', newProduct);

      alert('Product added successfully! ✅');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError('Failed to add product. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      <div className="header">
        <h1>Add New Product</h1>
        <Link to="/admin/products" className="back-link">← Back to Products</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cotton T-Shirt"
            required
          />
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <small>Max size: 5MB. Formats: JPG, PNG, WEBP, GIF</small>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        {/* NEW: Category dropdown */}
        <div className="form-group">
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="category-select"
          >
            <option value="">-- No category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <small>Optional — you can assign later</small>
        </div>

        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={priceDollars}
            onChange={(e) => setPriceDollars(e.target.value)}
            placeholder="e.g. 19.99"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Rating (Stars)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="5"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              placeholder="e.g. 4.5"
              required
            />
          </div>

          <div className="form-group">
            <label>Rating Count</label>
            <input
              type="number"
              min="0"
              value={ratingCount}
              onChange={(e) => setRatingCount(e.target.value)}
              placeholder="e.g. 120"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Keywords (comma-separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. shirt, cotton, men"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Uploading & Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}