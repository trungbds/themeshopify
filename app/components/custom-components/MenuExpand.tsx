import {createContext, type ReactNode, useState} from 'react';
import type { HeaderQuery } from 'storefrontapi.generated';
import {NavLink} from '@remix-run/react';

type ExpandType = 'search' | 'cart' | 'mobile' | 'closed';
type ExpandContextValue = {
  type: ExpandType;
  open: (mode: ExpandType) => void;
  close: () => void;
};

type Viewport = 'desktop' | 'mobile';

// Lấy kiểu của MenuItem từ HeaderQuery
type MenuItemType = HeaderQuery['menu'] extends { items: Array<infer I> } ? I : never;

interface MenuExpandProps {
  items: MenuItemType[];
}

export function MenuExpand({
  children,
  heading,
  type,
  items,
  viewport, 
  publicStoreDomain, 
  primaryDomainUrl,
}: {
  children?: React.ReactNode;
  type: ExpandType;
  heading: React.ReactNode;
  items : MenuExpandProps ; 
  viewport: Viewport;
  publicStoreDomain: String;
  primaryDomainUrl: String;
}) {
  // const {type: activeType, close} = useMenuExpand();
  // const expanded = type === activeType;


  function closeMenuExpand(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
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


  return (

    <div className='menu-expand'>
      {/* {items.map(item => (
        <div
          className={`menu-item ${item.items.length > 0?'submenu' : ''}`} 
          key={item.id}>
          <a href={item.url}>{item.title}</a>
          {item.items.length > 0 && (
            <ul>
              {item.items.map(subItem => (
                <li key={subItem.id}>
                  <a href={subItem.url}>{subItem.title}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

      ))} */}

      {items.map((item) => {
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
            onClick={closeMenuExpand}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}








    </div>
    
  );
}

const ExpandContext = createContext<ExpandContextValue | null>(null);

MenuExpand.Provider = function MenuExpandProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<ExpandType>('closed');

  return (
    <ExpandContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </ExpandContext.Provider>
  );
};
