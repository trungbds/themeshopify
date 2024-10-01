import React, { useState } from 'react';
import iconadd from '~/assets/fonts/icons/icon-add.svg';
import iconremove from '~/assets/fonts/icons/icon-remove.svg';
import iconclose from '~/assets/fonts/icons/icon-close.svg';

export default function Quantity({
  quantityAvailable,
  quantity, // Nhận quantity từ props
  onQuantityChange, // Nhận hàm thay đổi quantity từ props
}: {
  quantityAvailable?: number;
  quantity: number; // Thêm kiểu cho quantity
  onQuantityChange: (newQuantity: number) => void; // Định nghĩa kiểu cho onQuantityChange
}) {
  const [error, setError] = useState('');

  const MAX_QUANTITY = 10;
  const maxAllowedQuantity = Math.min(quantityAvailable ?? 0, MAX_QUANTITY);

  // Hàm để tăng số lượng
  const incrementQuantity = () => {
    if (quantity < maxAllowedQuantity) {
      onQuantityChange(quantity + 1); // Sử dụng hàm từ props để thay đổi quantity
      setError('');
    } else {
      setError(`${maxAllowedQuantity} items left in stock.`);
    }
  };

  // Hàm để giảm số lượng
  const decrementQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1); // Sử dụng hàm từ props để thay đổi quantity
      setError('');
    } else {
      setError('Quantity must be at least 1.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputQuantity = parseInt(e.target.value, 10);
    if (inputQuantity >= 1 && inputQuantity <= maxAllowedQuantity) {
      onQuantityChange(inputQuantity); // Sử dụng hàm từ props để thay đổi quantity
      setError('');
    } else {
      setError(`Quantity must be between 1 and ${maxAllowedQuantity}.`);
    }
  };

  return (
    <div className="quantity">
      <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white quantity-label">
        Quantity:
      </div>
      <div className="quantity-total">
        <button
          type="button"
          id="decrement-button"
          disabled={quantityAvailable === 0}
          onClick={decrementQuantity}
          className={quantityAvailable === 0 ? 'opacity-50 cursor-not-allowed' : ''}
        >
          <img className="dark:text-white" src={iconremove} alt="minus 1" />
        </button>
        <input
          type="text"
          id="quantity-input"
          value={quantity}
          onChange={handleInputChange}
          className="quantity-input"
          required
        />
        <button
          type="button"
          id="increment-button"
          disabled={quantityAvailable === 0}
          onClick={incrementQuantity}
          className={quantityAvailable === 0 ? 'opacity-50 cursor-not-allowed' : ''}
        >
          <img className="dark:text-white" src={iconadd} alt="add 1" />
        </button>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <div id="helper-text-explanation" className="btn-tooltip">
            <div className='tooltip-header'>
              <h5>Note</h5>
              <button className='btn-icon' onClick={() => setError('')}>
                <img src={iconclose} width={20} alt="Close tooltip" />
              </button>
            </div>
            <div className="tooltip-inner text-red-500 dark:text-red-400">
              {error}
            </div>
            <div className="tooltip-arrow" />
          </div>
        )}
      </div>
    </div>
  );
}
