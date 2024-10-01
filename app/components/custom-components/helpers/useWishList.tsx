import { useState, useEffect } from 'react';

// Hook để quản lý wishlist
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]); // Mảng lưu productId của sản phẩm trong wishlist

  useEffect(() => {
    // Lấy wishlist từ localStorage khi component mount
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      // Parse it as an array of strings
      setWishlist(JSON.parse(storedWishlist) as string[]); // Type assertion here
    }
  }, []);

  // Hàm để thêm sản phẩm vào wishlist
  const addToWishlist = (productId: string) => {
    const updatedWishlist = [...wishlist, productId];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // Hàm để xóa sản phẩm khỏi wishlist
  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlist.filter(id => id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // Kiểm tra xem sản phẩm có trong wishlist hay không
  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
