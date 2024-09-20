import React, { useState } from 'react';
import iconswap from '~/assets/fonts/icons/icon-swap.svg';
import icondropdown from '~/assets/fonts/icons/icon-dropdown.svg';

interface BoxSortProps {
  selectedSort?: string;
  countProducts?: number;
}

export function BoxSort({ selectedSort = "Featured", countProducts }: BoxSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState(selectedSort); // Quản lý trạng thái selectedSort

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSortSelection = (sortOption: string) => {
    setCurrentSort(sortOption); // Cập nhật giá trị của selectedSort
    setIsOpen(false); // Đóng menu sau khi chọn
  };

  return (
    <div className="box-sort relative">
      <div className='box-sort__btn'>
        <button
          type="button"
          className="group inline-flex justify-center text-gray-700 hover:text-gray-900"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleMenu}
        >
          <img src={iconswap} alt="Sort Icon" />
          Sort: <span> <strong>{currentSort}</strong> </span> {/* Hiển thị giá trị selectedSort hiện tại */}
          <img src={icondropdown} alt="Dropdown Icon" />
        </button>
        {isOpen && (
          <div
            className="box-sort__expand absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                onClick={() => handleSortSelection("Most Popular")}
              >
                Most Popular
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-900"
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleSortSelection("Featured")}
              >
                Featured
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-500"
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleSortSelection("Best Rating")}
              >
                Best Rating
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-500"
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleSortSelection("Newest")}
              >
                Newest
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-500"
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleSortSelection("Price: Low to High")}
              >
                Price: Low to High
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-500"
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleSortSelection("Price: High to Low")}
              >
                Price: High to Low
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
