import React, { useState, useEffect, useRef } from 'react';
import {NavLink} from '@remix-run/react';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {MenuExpand} from './MenuExpand';
import iconcategories from '~/assets/fonts/icons/icon-categories.svg';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type MenuState = 'menu' | 'search' | 'login' | 'closed';
type Viewport = 'desktop' | 'mobile';

export function CategoriesMegaMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  openOverlayClick,
  closeOverlayClick
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  openOverlayClick: () => void;
  closeOverlayClick: () => void;
}) {
  const [activeMenu, setActiveMenu] = useState<MenuState>('closed');
  const navRef = useRef<HTMLDivElement>(null); // Ref để theo dõi thành phần `nav`

  const handleMenuClick = () => {
    if (activeMenu === 'menu') {
      setActiveMenu('closed');
      closeOverlayClick(); // Gọi hàm khi đóng
    } else {
      setActiveMenu('menu');
      openOverlayClick(); // Gọi hàm khi mở
    }
  };

  // Đóng menu khi nhấp hoặc cuộn bên ngoài `nav`
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu('closed');
        closeOverlayClick(); // Gọi hàm khi nhấp bên ngoài
      }
    }

    function handleScroll() {
      setActiveMenu('closed');
      closeOverlayClick(); // Gọi hàm khi cuộn trang
    }

    if (activeMenu === 'menu') {
      document.addEventListener('click', handleClickOutside);
      // window.addEventListener('scroll', handleScroll);
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener('click', handleClickOutside);
      // window.removeEventListener('scroll', handleScroll);
    };
  }, [activeMenu, closeOverlayClick]);

  const className = `header-menu-${viewport}`;
  const items = menu?.items || [];  // Đảm bảo rằng `items` luôn là một mảng, ngay cả khi `menu` là `undefined`.

  return (
    <nav ref={navRef} className={className} role="navigation">
      <button 
        onClick={handleMenuClick}
        type="button" 
        className="categories-btn hover:bg-[#f3f4f6]/90 focus:ring-4 focus:outline-none focus:ring-[#f3f4f6]/50 px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#f3f4f6]/55 me-2 mb-2"
      >
        <img className='w-4 h-4 me-2' src={iconcategories} alt="" />
        <span>Categories</span>
        {activeMenu === 'menu' && items.length > 0 && (
          <MenuExpand 
            primaryDomainUrl={primaryDomainUrl}
            publicStoreDomain={publicStoreDomain}
            items={items}
          />
        )}
      </button>
    </nav>
  );
}
