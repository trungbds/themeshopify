import React, {useState} from 'react';
import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

// custom
import { SearchHeader } from './custom-components/SearchHeader';
import { CategoriesMegaMenu } from './custom-components/CategoriesMegaMenu';
import iconmenu from '~/assets/fonts/icons/icon-menu.svg';
import HeaderSignIn  from './custom-components/HeaderSignIn';
import HeaderAccount  from './custom-components/HeaderAccount';
import HeaderSupportBtn from './custom-components/HeaderSupportBtn';
import CartHeader from './custom-components/CartHeader';
import icondropdown from '~/assets/fonts/icons/icon-dropdown.svg';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';




interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

type MenuItemType = NonNullable<HeaderQuery['menu']>['items'][number];

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

      <div className="header-container grid md:grid-cols-12 grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3 flex items-center">
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
            <img src={logoUrl} alt={shop.name} />
          </NavLink>
          <CategoriesMegaMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
            openOverlayClick={openOverlayClick}
            closeOverlayClick={closeOverlayClick}
          />
        </div>

        <div className="col-span-2 md:col-span-6 flex items-center justify-center">
          <SearchHeader 
            openOverlayClick={openOverlayClick}
            closeOverlayClick={closeOverlayClick}
          />
        </div>

        <div className="col-span-1 md:col-span-3  flex items-center ">
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

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleOpen = (id: string) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [id]: !prevOpenItems[id], // Toggle trạng thái open của từng item
    }));
  };

  const closeAside = (event: React.MouseEvent<HTMLAnchorElement>) =>{
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }


  const items = menu?.items || [];

  const renderItems = (items: MenuItemType[]) => {
    return items.map((item) => {
      if (!item.url) return null;

      const url =
        item.type === "COLLECTION"
          ? `/c${new URL(item.url).pathname.replace('/collections', '')}`
          : item.type === "PRODUCT"
          ? `/p${new URL(item.url).pathname.replace('/products', '')}`
          : item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
          ? new URL(item.url).pathname
          : item.url;

      const isSubMenu = item.items && item.items.length > 0;
      const isOpen = openItems[item.id]; // Kiểm tra trạng thái mở của item

      return (
        <div
          className={`${isSubMenu ? 'menu-item__group' : 'menu-item'} ${
            isOpen ? 'open' : ''
          }`} // Thêm class "open" khi item được mở
          key={item.id}
        >
          {!isSubMenu ? (
            <NavLink
              end
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
              className={`${isSubMenu ? 'menu-item__title' : ''}`}
              onClick={closeAside}
            >
              <span>{item.title}</span>
              <img src={iconchevronright} alt="icon chevronright" />
            </NavLink>
          ) : (
            <>
              <div
                className="menu-item menu-item__title"
                onClick={() => toggleOpen(item.id)} // Gọi toggleOpen khi nhấp vào
              >
                <span>{item.title}</span>
                <img src={icondropdown} alt="icon dropdown" />
              </div>
              <div className="sub-menu nested-sub-menu">
                <div className="menu-item">
                  <NavLink end prefetch="intent" style={activeLinkStyle} to={url} onClick={closeAside}>
                    {`All ${item.title}`}
                    <img src={iconchevronright} alt="icon chevronright" />
                  </NavLink>
                </div>
                {renderItems(item.items)} {/* Gọi lại hàm renderItems cho các item con */}
              </div>
            </>
          )}
        </div>
      );
    });
  };

  
  return (
    <nav className={`header-menu-${viewport}`} role="navigation">
      {viewport === 'mobile' && (
        <div className="menu-item">
          <NavLink 
            prefetch="intent" 
            style={activeLinkStyle} 
            to="/"
            onClick={closeAside}
          >
            Home
          </NavLink>
        </div>
      )}
      {renderItems(items)}
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
      <img src={iconmenu} alt="" />
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



const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/c/all',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
