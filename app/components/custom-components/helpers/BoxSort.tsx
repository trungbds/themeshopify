import React, { useState, useEffect } from 'react';
import iconswap from '~/assets/fonts/icons/icon-swap.svg';
import icondropdown from '~/assets/fonts/icons/icon-dropdown.svg';
import { Link, useSearchParams } from '@remix-run/react';

interface BoxSortProps {
  selectedSort?: string;
  countProducts?: number;
}

const sortKeyLabels: { [key: string]: string } = {
  MANUAL: 'Most Popular',
  TITLE: 'Featured',
  BEST_SELLING: 'Best Selling',
  CREATED: 'Newest',
  PRICE_ASC: 'Price: Low to High', // Đặt tên cho tùy chọn này
  PRICE_DESC: 'Price: High to Low', // Đặt tên cho tùy chọn này
};

export function BoxSort({ selectedSort = "Featured", countProducts }: BoxSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [currentSortKey, setCurrentSortKey] = useState<string>(searchParams.get("sortKey") || 'TITLE');
  const [currentReverse, setCurrentReverse] = useState<boolean>(searchParams.get("reverse") === 'true');

  useEffect(() => {
    const newSortKey = searchParams.get("sortKey") || 'TITLE';
    const newReverse = searchParams.get("reverse") === 'true';
    setCurrentSortKey(newSortKey);
    setCurrentReverse(newReverse);
  }, [searchParams]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const createUrl = (newSortKey: string, newReverse: boolean = false) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sortKey");
    params.delete("reverse");
    if (newSortKey === 'PRICE') {
      params.set("sortKey", "PRICE");
      params.set("reverse", newReverse.toString());
    } else {
      params.set("sortKey", newSortKey);
    }
    return `?${params.toString()}`;
  };

  const handleLinkClick = () => {
    setIsOpen(false);
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
          Sort: <span><strong>{sortKeyLabels[currentSortKey] || sortKeyLabels['PRICE_ASC']}</strong></span>
          <img className='icon' src={icondropdown} alt="Dropdown Icon" />
        </button>
        {isOpen && (
          <div
            className="box-sort__expand absolute right-0 z-10 mt-0 bg-white shadow-lg focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <Link
                className="block px-4 py-2 text-gray-900"
                to={createUrl("MANUAL", false)}
                onClick={handleLinkClick}
                role="menuitem"
                prefetch="intent"
                tabIndex={-1}
              >
                Most Popular
              </Link>
              <Link
                className="block px-4 py-2 text-gray-900"
                to={createUrl("TITLE", false)}
                onClick={handleLinkClick}
                role="menuitem"
                prefetch="intent"
                tabIndex={-1}
              >
                Featured
              </Link>
              <Link
                className="block px-4 py-2 text-gray-900"
                to={createUrl("BEST_SELLING", false)}
                onClick={handleLinkClick}
                role="menuitem"
                prefetch="intent"
                tabIndex={-1}
              >
                Best Selling
              </Link>
              <Link
                className="block px-4 py-2 text-gray-900"
                to={createUrl("CREATED", false)}
                onClick={handleLinkClick}
                role="menuitem"
                prefetch="intent"
                tabIndex={-1}
              >
                Newest
              </Link>
              <Link
                className="block px-4 py-2 text-gray-900"
                to={createUrl("PRICE", false)}
                onClick={handleLinkClick}
                role="menuitem"
                prefetch="intent"
                tabIndex={-1}
              >
                Price: Low to High
              </Link>
              <Link
                className="block px-4 py-2 text-gray-900"
                to={createUrl("PRICE", true)}
                onClick={handleLinkClick}
                role="menuitem"
                prefetch="intent"
                tabIndex={-1}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
