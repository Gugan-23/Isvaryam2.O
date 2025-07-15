import axios from '../axiosConfig'; // ✅ use your config, not plain 'axios'


export const getReviewsByProductId = async (productId) => {
  const { data } = await axios.get(`/api/reviews/product/${productId}`);
  return data;
};
