import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { getImageUrl } from '../../utils/imageUrl';
import './AddProduct.css'; // Reusing the same CSS

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function EditProduct() {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [currentImage, setCurrentImage] = useState(''); // Existing image path
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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Load categories on mount
  useEffect(() => {
    axios
      .get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Load the existing product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        const product = response.data;

        setName(product.name);
        setCurrentImage(product.image);
        setPriceDollars((product.priceCents / 100).toFixed(2));
        setStars(product.rating.stars.toString());
        setRatingCount(product.rating.count.toString());
        setKeywords(product.keywords.join(', '));
        setCategoryId(product.categoryId || '');  // NEW - pre-select current category
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      } finally {
        setFetching(false);
      }
    };

    loadProduct();
  }, [id]);

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
      let imagePath = currentImage; // Keep the old image by default

      // If user selected a new image, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        imagePath = uploadResponse.data.imagePath;
      }

      // Update the product (now includes categoryId)
      const updatedProduct = {
        name,
        image: imagePath,
        priceCents: Math.round(parseFloat(priceDollars) * 100),
        rating: {
          stars: parseFloat(stars),
          count: parseInt(ratingCount)
        },
        keywords: keywords.split(',').map(k => k.trim()),
        categoryId: categoryId || null  // send null if "No category"
      };

      await axios.put(`/api/products/${id}`, updatedProduct);

      alert('Product updated successfully! ✅');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError('Failed to update product. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="add-product"><p>Loading product...</p></div>;
  }

  return (
    <div className="add-product">
      <div className="header">
        <h1>Edit Product</h1>
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
            required
          />
        </div>

        <div className="form-group">
          <label>Current Image</label>
          <div className="image-preview">
            <img src={getImageUrl(currentImage)} alt="Current" />
          </div>

          <label style={{ marginTop: '15px' }}>Change Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <small>Leave empty to keep the current image</small>

          {imagePreview && (
            <div className="image-preview" style={{ marginTop: '10px' }}>
              <p><strong>New Image Preview:</strong></p>
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
          <small>Change or remove the category for this product</small>
        </div>

        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={priceDollars}
            onChange={(e) => setPriceDollars(e.target.value)}
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
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}