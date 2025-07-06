import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Price from '../Price/Price';
import StarRating from '../StarRating/StarRating';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/usewishlist';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import classes from './TopSelling.module.css';
import axios from 'axios';

export default function TopSelling({ foods }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [dialog, setDialog] = useState({ open: false, message: '' });
  const [averageRatings, setAverageRatings] = useState({});
  const [shuffledFoods, setShuffledFoods] = useState([]);

  // Shuffle products when foods change
  useEffect(() => {
    if (!foods || foods.length === 0) return;
    
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    setShuffledFoods(shuffleArray(foods));
  }, [foods]);

  const fetchAverageRatings = useCallback(async () => {
    try {
      const ratings = {};
      await Promise.all(
        shuffledFoods.map(async (food) => {
          const res = await axios.get(`/api/reviews/product/${food._id}`);
          const reviews = res.data || [];
          const total = reviews.reduce((sum, r) => sum + r.rating, 0);
          const average = reviews.length ? total / reviews.length : 0;
          ratings[food._id] = average;
        })
      );
      setAverageRatings(ratings);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  }, [shuffledFoods]);

  useEffect(() => {
    if (shuffledFoods && shuffledFoods.length > 0) {
      fetchAverageRatings();
    }
  }, [fetchAverageRatings, shuffledFoods]);

  const handleAddToCart = (food, e) => {
    e.stopPropagation();
    const size = food.quantities[0].size; // Always use first size
    addToCart(food, size);
    navigate('/cart');
  };

  const handleBuyNow = (food, e) => {
    e.stopPropagation();
    const size = food.quantities[0].size; // Always use first size
    addToCart(food, size);
    navigate('/checkout');
  };

  const handleCardClick = (food) => {
    navigate(`/food/${food._id}`);
  };

  const handleWishlist = async (food, e) => {
    e.stopPropagation();
    const alreadyWishlisted = isInWishlist(food._id);
    await toggleWishlist(food);
    setDialog({
      open: true,
      message: alreadyWishlisted
        ? `"${food.name}" removed from wishlist!`
        : `"${food.name}" added to wishlist!`,
    });
    setTimeout(() => setDialog({ open: false, message: '' }), 1500);
  };

  if (!shuffledFoods || shuffledFoods.length === 0) {
    return <div className={classes.noProducts}>No products available.</div>;
  }

  return (
    <>
      {dialog.open && (
        <div className={classes.centerDialogBox}>{dialog.message}</div>
      )}

      <div className={classes.titleContainer}>
        <h2>Top Best Selling</h2>
      </div>

      <div className={classes.productsGrid}>
         {shuffledFoods
          .filter(
            (food) =>
              Array.isArray(food.quantities) && food.quantities.length > 0
          )
          .slice(0, 3) // 👈 Only take first 3 products after filtering
          .map((food) =>(
            <div
              key={food._id}
              className={classes.productCard}
              onClick={() => handleCardClick(food)}
              style={{ cursor: 'pointer' }}
            >
              <div className={classes.imageContainer}>
                <img
                  className={classes.productImage}
                  src={food.images?.[0]}
                  alt={food.name}
                />
                <div className={classes.organicBadge}>
                  <span>Best</span>
                </div>
                <div
                  className={classes.wishlistIcon}
                  onClick={(e) => handleWishlist(food, e)}
                  title={
                    isInWishlist(food._id)
                      ? 'Remove from Wishlist'
                      : 'Add to Wishlist'
                  }
                  style={{
                    background: isInWishlist(food._id)
                      ? '#fff0f0'
                      : 'rgba(255,255,255,0.85)',
                    color: '#e53935',
                    border: isInWishlist(food._id)
                      ? '1.5px solid #e53935'
                      : 'none',
                  }}
                >
                  {isInWishlist(food._id) ? (
                    <AiFillHeart size={26} color="#e53935" />
                  ) : (
                    <AiOutlineHeart size={26} color="#e53935" />
                  )}
                </div>
              </div>

              <div className={classes.productInfo}>
                <div className={classes.name}>{food.name}</div>

                <div className={classes.productFooter}>
                  <div className={classes.stars}>
                    <StarRating stars={averageRatings[food._id] || 0} />
                  </div>
                  <div className={classes.price}>
                    <Price price={food.quantities[0]?.price} />
                  </div>
                </div>

                <div className={classes.sizeDisplay}>
                  {food.quantities[0]?.size} - ₹{food.quantities[0]?.price}
                </div>

                <div className={classes.buttonGroup}>
                  <button
                    className={classes.addToCart}
                    onClick={(e) => handleAddToCart(food, e)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}