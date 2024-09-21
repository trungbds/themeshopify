import React, {useState} from 'react';
import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

// custom
import { SearchHeader } from './custom-components/SearchHeader';
import { CategoriesMegaMenu } from './custom-components/CategoriesMegaMenu';
import iconcart from '~/assets/fonts/icons/icon-bag.svg';
import HeaderSignIn  from './custom-components/HeaderSignIn';
import HeaderAccount  from './custom-components/HeaderAccount';
import HeaderSupportBtn from './custom-components/HeaderSupportBtn';
import CartHeader from './custom-components/CartHeader';



interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  
  const {shop, menu} = header;
  const logoUrl: string = shop.brand?.logo?.image?.url ?? '';

  // overlay 
  const [overlayActive, setOverlayActive] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);


  const openOverlayClick = () => {
    if (!hasActivated) {
      setOverlayActive(true);
      setHasActivated(true);
    }
  };

  const closeOverlayClick = () => {
      // Chỉ đóng nếu nguồn hiện tại là thành phần đang yêu cầu đóng
      setOverlayActive(false);
      setHasActivated(false);
  };

  return (
    // HEADER
    <header className="header">

      <div className="header-container grid grid-cols-12 gap-4">
        <div className="col-span-3 flex items-center">
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
            <img src={logoUrl} alt={shop.name} />
          </NavLink>
          <CategoriesMegaMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>

        <div className="col-span-6 flex items-center justify-center">
          <SearchHeader 
            openOverlayClick={openOverlayClick}
            closeOverlayClick={closeOverlayClick}
          />
        </div>

        <div className="col-span-3 flex items-center ">
          <HeaderCtas 
            isLoggedIn={isLoggedIn} 
            cart={cart} 
          />
          <CartHeader 
            openOverlayClick={openOverlayClick}
            closeOverlayClick={closeOverlayClick}
            cart={cart}
          />

        </div>
      </div>

      {/* overlay */}
      <div className={`header-overlay ${overlayActive ? 'active' : ''}`}></div>
    </header>
  );
}

export function HeaderMenu({
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
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <div className="header-ctas" role="navigation">
      {/* header menu mobile btn */}
      <HeaderMenuMobileToggle />

      <HeaderSupportBtn/> 

      <Suspense fallback='loading'>
        <Await 
          resolve={isLoggedIn} 
          errorElement="Error">
          {(isLoggedIn) => (
            (isLoggedIn ? <HeaderAccount/> : <HeaderSignIn/>)
          )}
          
        </Await>
      </Suspense>
    </div>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>MENU MOBIE ICON</h3>
    </button>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
