import axios from 'axios';
import { useEffect, useState } from 'react';
import './ReviewsSection.css';

export function ReviewsSection({ productId, onReviewChange }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews?productId=${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authorName.trim() || !comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/reviews', {
        productId,
        authorName,
        rating,
        comment
      });

      // Reset form
      setAuthorName('');
      setRating(5);
      setComment('');
      setShowForm(false);

      // Reload reviews + notify parent to reload product rating
      await loadReviews();
      if (onReviewChange) onReviewChange();
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Format date like "Oct 15, 2024"
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Customer Reviews ({reviews.length})</h2>
        {!showForm && (
          <button
            className="write-review-btn"
            onClick={() => setShowForm(true)}
          >
            + Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
          <h3>Write Your Review</h3>

          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. John D."
              required
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`star-btn ${n <= (hoveredStar || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoveredStar(n)}
                  onMouseLeave={() => setHoveredStar(0)}
                >
                  ★
                </span>
              ))}
              <span className="rating-number">{rating} / 5</span>
            </div>
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-review-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="loading-reviews">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">
          <p>💭 No reviews yet</p>
          <span>Be the first to share your thoughts!</span>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-author">
                  <div className="author-avatar">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="author-name">{review.authorName}</div>
                    <div className="review-date">{formatDate(review.createdAt)}</div>
                  </div>
                </div>
                <div className="review-stars">
                  {'★'.repeat(review.rating)}
                  <span className="unfilled-stars">
                    {'★'.repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}