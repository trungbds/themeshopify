import React, { useState } from 'react';
import iconadd from '~/assets/fonts/icons/icon-add.svg';
import iconremove from '~/assets/fonts/icons/icon-remove.svg';
import iconclose from '~/assets/fonts/icons/icon-close.svg';

export default function Quantity({
  quantityAvailable,
}: {
  quantityAvailable?: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  // Tổng số lượng có thể mua 
  const MaxQuantityAvailable = 10;

  // Xác định giới hạn số lượng tối đa mà khách hàng có thể mua
  const maxAllowedQuantity = quantityAvailable && quantityAvailable > MaxQuantityAvailable ? MaxQuantityAvailable : quantityAvailable ?? 0;

  // Hàm để tăng số lượng
  const incrementQuantity = () => {
    if (quantity < maxAllowedQuantity) {
      setQuantity(quantity + 1);
      setError('');
    } else {
      setError(`${maxAllowedQuantity} items left in stock.`);
    }
  };

  // Hàm để giảm số lượng
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setError('');
    } else {
      setError('Quantity must be at least 1.');
    }
  };

  return (
    <div className="quantity">
      <div
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white quantity-label"
      >
        Quantity:
      </div>
      <div className="quantity-total">
        <button
          type="button"
          id="decrement-button"
          disabled={quantityAvailable === 0}
          onClick={decrementQuantity}
          className={`${quantityAvailable === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <img className="dark:text-white" src={iconremove} alt="minus 1" />
        </button>
        <input
          type="text"
          id="quantity-input"
          value={quantity}
          onChange={(e) => {
            const inputQuantity = parseInt(e.target.value, 10);
            if (inputQuantity >= 1 && inputQuantity <= maxAllowedQuantity) {
              setQuantity(inputQuantity);
              setError('');
            } else {
              setError(`Quantity must be between 1 and ${maxAllowedQuantity}.`);
            }
          }}
          className="quantity-input"
          required
        />
        <button
          type="button"
          id="increment-button"
          disabled={quantityAvailable === 0}
          onClick={incrementQuantity}
          className={`${quantityAvailable === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <img className="dark:text-white" src={iconadd} alt="add 1" />
        </button>

        {/* Nếu có lỗi, hiển thị thông báo lỗi */}
        {error && (
          <div 
            id="helper-text-explanation"
            className=" btn-tooltip"
          >
            <div className='tooltip-header'>
              <h5>Note</h5>
              <button className='btn-icon'>
                <img src={iconclose} width={20} />
              </button>
              
            </div>
          
            <div className="tooltip-inner text-red-500 dark:text-red-400">
              {error}
            </div>
            <div className="tooltip-arrow"/>
          </div>
        )}
      </div>
      
    </div>
  );
}
