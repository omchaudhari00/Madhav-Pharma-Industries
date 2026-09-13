import React, { useState, useEffect, useCallback } from 'react';
import { Star, User, ChevronDown, ChevronUp, Send, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://madhav-pharma-industries.onrender.com';

// ---------- Types ----------

interface ReviewItem {
  id: number;
  customer_name: string;
  rating: number;
  comment: string | null;
  review_date: string;
}

interface RatingStats {
  average: number;
  total: number;
  breakdown: Record<string, number>;
}

// ---------- Dummy fallback (shown only when there are 0 real reviews) ----------

const DUMMY_REVIEWS: ReviewItem[] = [
  { id: -1, customer_name: 'Ravi Sharma', rating: 5, comment: 'Excellent quality! Very pure and authentic aroma. Will definitely order again.', review_date: '2026-08-15T10:30:00Z' },
  { id: -2, customer_name: 'Priya Nair', rating: 4, comment: 'Good product, packaging could be better but the oil itself is top notch.', review_date: '2026-07-28T14:15:00Z' },
  { id: -3, customer_name: 'Amit K.', rating: 5, comment: null, review_date: '2026-07-10T09:00:00Z' },
  { id: -4, customer_name: 'Sunita Verma', rating: 4, comment: 'Very satisfied with the purity. Price is reasonable too.', review_date: '2026-06-22T16:45:00Z' },
  { id: -5, customer_name: 'Rahul Patel', rating: 3, comment: 'Decent product. Delivery was a bit slow but quality was fine.', review_date: '2026-06-05T11:20:00Z' },
];

const DUMMY_STATS: RatingStats = {
  average: 4.2,
  total: 45,
  breakdown: { '5': 25, '4': 12, '3': 5, '2': 2, '1': 1 },
};

// ---------- Helper Components ----------

function StarDisplay({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill="none">
            {half ? (
              <>
                <defs>
                  <linearGradient id={`half-${star}`}>
                    <stop offset="50%" stopColor="#d4a373" />
                    <stop offset="50%" stopColor="#e5e7eb" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={`url(#half-${star})`}
                  stroke="#d4a373"
                  strokeWidth="0.5"
                />
              </>
            ) : (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={filled ? '#d4a373' : '#e5e7eb'}
                stroke={filled ? '#c29161' : '#d1d5db'}
                strokeWidth="0.5"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = (hovered || value) >= star;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 cursor-pointer focus:outline-none"
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={isActive ? '#d4a373' : '#f3f4f6'}
                stroke={isActive ? '#c29161' : '#d1d5db'}
                strokeWidth="1"
                className="transition-colors duration-150"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 group">
      <span className="text-xs font-semibold text-neutral-600 w-10 text-right shrink-0">{label} star</span>
      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#d4a373] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-neutral-500 w-8 shrink-0">{pct}%</span>
      <span className="text-xs text-neutral-400 w-6 shrink-0">({count})</span>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// ---------- Main Component ----------

interface ProductReviewsProps {
  productId: string;
}

const REVIEWS_PREVIEW_COUNT = 3;

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { user, token, openAuth } = useApp();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isDummy, setIsDummy] = useState(false);

  // Submission state
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  // ---------- Fetch reviews ----------

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/interactions/reviews/by_product/?product_id=${encodeURIComponent(productId)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.stats.total === 0) {
          // Use dummy fallback so UI never looks empty
          setReviews(DUMMY_REVIEWS);
          setStats(DUMMY_STATS);
          setIsDummy(true);
        } else {
          setReviews(data.reviews);
          setStats(data.stats);
          setIsDummy(false);
        }
      } else {
        setReviews(DUMMY_REVIEWS);
        setStats(DUMMY_STATS);
        setIsDummy(true);
      }
    } catch {
      setReviews(DUMMY_REVIEWS);
      setStats(DUMMY_STATS);
      setIsDummy(true);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ---------- Submit ----------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    if (myRating === 0) {
      setSubmitMsg({ type: 'error', text: 'Please select a star rating before submitting.' });
      return;
    }

    setSubmitting(true);
    setSubmitMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/interactions/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: productId,
          rating: myRating,
          comment: myComment.trim() || null,
        }),
      });

      if (res.ok || res.status === 201) {
        setSubmitMsg({ type: 'success', text: 'Your review has been submitted! Thank you.' });
        setMyRating(0);
        setMyComment('');
        setHasReviewed(true);
        await fetchReviews();
      } else {
        const data = await res.json();
        const errText =
          data?.detail ||
          data?.non_field_errors?.[0] ||
          (data?.detail && typeof data.detail === 'string' ? data.detail : null) ||
          'Failed to submit review. Please try again.';
        setSubmitMsg({ type: 'error', text: errText });
      }
    } catch {
      setSubmitMsg({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setSubmitting(false);
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, REVIEWS_PREVIEW_COUNT);
  const isCustomer = user?.role === 'Customer';

  return (
    <section className="mt-12 mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="border-t border-neutral-200 pt-10 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Star className="w-5 h-5 text-[#d4a373] fill-[#d4a373]" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">Customer Reviews</h2>
        </div>
        <p className="text-sm text-neutral-500">What our customers are saying about this product</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-start">

          {/* LEFT: Rating Summary */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-5 lg:sticky lg:top-6">
            {stats && (
              <>
                {/* Big average number */}
                <div className="flex items-end gap-4">
                  <div>
                    <div className="text-5xl font-extrabold font-serif text-neutral-900 leading-none">
                      {stats.average.toFixed(1)}
                    </div>
                    <div className="text-sm text-neutral-500 mt-1">out of 5</div>
                  </div>
                  <div className="pb-1">
                    <StarDisplay rating={stats.average} size={22} />
                    <p className="text-xs text-neutral-500 mt-1.5 font-medium">
                      {stats.total.toLocaleString()} {stats.total === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                </div>

                {/* Per-star bars */}
                <div className="space-y-2.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <RatingBar
                      key={star}
                      label={String(star)}
                      count={stats.breakdown[String(star)] || 0}
                      total={stats.total}
                    />
                  ))}
                </div>

                {isDummy && (
                  <p className="text-[10px] text-neutral-400 italic border-t border-neutral-100 pt-3">
                    Sample ratings shown for illustration. Be the first to leave a real review!
                  </p>
                )}
              </>
            )}

            {/* Write a Review CTA */}
            <div className="border-t border-neutral-100 pt-4">
              {!user ? (
                <div className="text-center">
                  <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
                    Sign in as a customer to leave your review.
                  </p>
                  <button
                    onClick={() => openAuth('signin')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d4a373] hover:bg-[#c29161] text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Sign In to Review
                  </button>
                </div>
              ) : !isCustomer ? (
                <p className="text-xs text-neutral-400 text-center italic">
                  Only customer accounts can submit reviews.
                </p>
              ) : hasReviewed ? (
                <p className="text-xs text-emerald-600 font-semibold text-center">
                  Your review has been submitted. Thank you!
                </p>
              ) : null}
            </div>
          </div>

          {/* RIGHT: Review List + Form */}
          <div className="space-y-6">

            {/* Review Form (Customer only) */}
            {user && isCustomer && !hasReviewed && (
              <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider mb-4">
                  Write Your Review
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block mb-2">
                      Your Rating <span className="text-red-500">*</span>
                    </label>
                    <StarPicker value={myRating} onChange={setMyRating} />
                    {myRating > 0 && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][myRating]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block mb-2">
                      Your Comment <span className="text-neutral-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/50 focus:border-[#d4a373] resize-none transition-colors"
                    />
                    <p className="text-[10px] text-neutral-400 text-right mt-1">{myComment.length}/500</p>
                  </div>
                  {submitMsg && (
                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
                      submitMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {submitMsg.text}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting || myRating === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      submitting || myRating === 0
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-[#d4a373] hover:bg-[#c29161] text-black shadow-md active:scale-95'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {/* Individual Reviews */}
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#d4a373]/20 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-[#8a5d2b]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{review.customer_name}</p>
                        <p className="text-[11px] text-neutral-500">{formatDate(review.review_date)}</p>
                      </div>
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <StarDisplay rating={review.rating} size={14} />
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
                  )}
                  {!review.comment && (
                    <p className="text-xs text-neutral-400 italic">No written comment.</p>
                  )}
                </div>
              ))}
            </div>

            {/* Show more/less */}
            {reviews.length > REVIEWS_PREVIEW_COUNT && (
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-bold text-[#8a5d2b] hover:text-[#c29161] transition-colors cursor-pointer"
              >
                {showAll ? (
                  <><ChevronUp className="w-4 h-4" /> Show fewer reviews</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> Show all {reviews.length} reviews</>
                )}
              </button>
            )}

            {reviews.length === 0 && (
              <div className="text-center py-12 text-neutral-400">
                <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No reviews yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
