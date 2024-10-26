import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from '@remix-run/react';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { MenuExpand } from './MenuExpand';
import iconcategories from '~/assets/fonts/icons/icon-categories.svg';
import { IconCategories } from './icons/IconCategories';
import { IconDefaultClose } from './icons/default/IconDefaultClose';
import { IconDefaultCategories } from './icons/default/IconDefaultCategories';
import useHeaderOverlay from './helpers/useHeaderOverlay';

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
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const [activeMenu, setActiveMenu] = useState<MenuState>('closed');
  const navRef = useRef<HTMLDivElement>(null);

  // Sử dụng useHeaderOverlay để quản lý overlay khi dropdown mở
  const [isOverlayOpen, openOverlay, closeOverlay] = useHeaderOverlay();

  const handleMenuClick = () => {
    if (activeMenu === 'menu') {
      setActiveMenu('closed');
      closeOverlay();
    } else {
      setActiveMenu('menu');
      openOverlay();
    }
  };

  // Đóng menu khi nhấp hoặc cuộn bên ngoài `nav`
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu('closed');
        closeOverlay();
      }
    }

    function handleScroll() {
      setActiveMenu('closed');
      closeOverlay();
    }

    if (activeMenu === 'menu') {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeMenu, closeOverlay]);

  const className = `header-menu-${viewport}`;
  const items = menu?.items || [];

  return (
    <nav ref={navRef} className={className} role="navigation">
      <button 
        onClick={handleMenuClick}
        type="button" 
        className="categories-btn hover:bg-[#f3f4f6]/90 focus:ring-4 focus:outline-none focus:ring-[#f3f4f6]/50 px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#f3f4f6]/55 me-2 mb-2"
      >
        {(activeMenu === 'menu' && items.length > 0) ? <IconDefaultClose /> : <IconDefaultCategories />}
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
