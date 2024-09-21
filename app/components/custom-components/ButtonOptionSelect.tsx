import React, { useState } from 'react';
import iconswap from '~/assets/fonts/icons/icon-swap.svg';
import icondropdown from '~/assets/fonts/icons/icon-dropdown.svg';

interface ButtonOptionSelectProps {
    label?: string;
    selectedDefault?: string;
    countProducts?: number;
}

export function ButtonOptionSelect({ selectedDefault, label, countProducts }: ButtonOptionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSelect, setCurrentSelect] = useState(selectedDefault); 

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectSelection = (optionSelect: string) => {
    setCurrentSelect(optionSelect); // Cập nhật giá trị của selectedSort
    setIsOpen(false); // Đóng menu sau khi chọn
  };

  return (
      <div className='button-select__btn relative'>
        <button
          type="button"
          className="btn group text-gray-700 hover:text-gray-900"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleMenu}
        >
            <div className='text-left'>
                <span>{label}</span>
                <span className='selected-value'>{currentSelect}</span> {/* Hiển thị giá trị selectedSort hiện tại */}
            </div>
            <img src={icondropdown} alt="Dropdown Icon" />
        </button>
        {isOpen && (
          <div
            className="button-select__expand absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <a
                href="#"
                className="block px-4 py-2 text-gray-900"
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleSelectSelection("English")}
              >
                English
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-900"
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleSelectSelection("Español")}
              >
                Español
              </a>
            </div>
          </div>
        )}
      </div>
    );
}
