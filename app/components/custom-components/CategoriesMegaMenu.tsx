import React, { useState } from 'react';
import {NavLink} from '@remix-run/react';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {MenuExpand} from './MenuExpand';

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
    const handleMenuClick = () => setActiveMenu(activeMenu === 'menu' ? 'closed' : 'menu');


    const className = `header-menu-${viewport}`;
    const {items} = menu;
    // console.log (items);
  
    function closeMenuExpand(event: React.MouseEvent<HTMLAnchorElement>) {
      if (viewport === 'mobile') {
        event.preventDefault();
        window.location.href = event.currentTarget.href;
      }
    }
  
    return (
      <nav className={className} role="navigation">
        <button 
          onClick={handleMenuClick}
          type="button" 
          className="categories-btn hover:bg-[#f3f4f6]/90 focus:ring-4 focus:outline-none focus:ring-[#f3f4f6]/50 px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#f3f4f6]/55 me-2 mb-2"
          >
            <svg 
              className='w-4 h-4 me-2'
              width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_436_6261)">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M10.71 6.6H8.82C7.776 6.6 6.93 7.4058 6.93 8.4V10.2C6.93 11.1942 7.776 12 8.82 12H10.71C11.754 12 12.6 11.1942 12.6 10.2V8.4C12.6 7.4058 11.754 6.6 10.71 6.6ZM3.78 6.6H1.89C0.846 6.6 0 7.4058 0 8.4V10.2C0 11.1942 0.846 12 1.89 12H3.78C4.824 12 5.67 11.1942 5.67 10.2V8.4C5.67 7.4058 4.824 6.6 3.78 6.6ZM10.71 0H8.82C7.776 0 6.93 0.8058 6.93 1.8V3.6C6.93 4.5942 7.776 5.4 8.82 5.4H10.71C11.754 5.4 12.6 4.5942 12.6 3.6V1.8C12.6 0.8058 11.754 0 10.71 0ZM5.67 1.8V3.6C5.67 4.5942 4.824 5.4 3.78 5.4H1.89C0.846 5.4 0 4.5942 0 3.6V1.8C0 0.8058 0.846 0 1.89 0H3.78C4.824 0 5.67 0.8058 5.67 1.8Z" 
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_436_6261">
                  <rect width="12.6" height="12" fill="white"/>
                </clipPath>
              </defs>
            </svg>

            Categories
           {activeMenu === 'menu' && 
            <MenuExpand 
              primaryDomainUrl = {primaryDomainUrl}
              publicStoreDomain={publicStoreDomain}
              items = {items}
            />}
        </button>
      </nav>
    );
  }
  