import React, { createContext, type ReactNode, useState } from 'react';
import type { HeaderQuery } from 'storefrontapi.generated';
import { NavLink } from '@remix-run/react';

type ExpandType = 'search' | 'cart' | 'mobile' | 'closed';
type ExpandContextValue = {
  type: ExpandType;
  open: (mode: ExpandType) => void;
  close: () => void;
};

type Viewport = 'desktop' | 'mobile';

// Xác định rõ ràng kiểu MenuItemType
type MenuItemType = NonNullable<HeaderQuery['menu']>['items'][number];

interface MenuExpandProps {
  items: MenuItemType[];
}

interface MenuExpandComponentProps {
  children?: React.ReactNode;
  type: ExpandType;
  heading: React.ReactNode;
  items: MenuItemType[]; 
  viewport: Viewport;
  publicStoreDomain: string;
  primaryDomainUrl: string;
}

export function MenuExpand({
  children,
  heading,
  type,
  items,
  viewport, 
  publicStoreDomain, 
  primaryDomainUrl,
}: MenuExpandComponentProps) {
  
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

      return (
        <div className="menu-item" key={item.id}> {/* Đổi tên class cho item cha */}
          <NavLink
            end
            onClick={closeMenuExpand}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
          {item.items && item.items.length > 0 && (
            <div className="sub-menu nested-sub-menu"> {/* Đổi tên class cho sub-menu */}
              {renderItems(item.items)} {/* Gọi lại hàm renderItems cho các item con */}
            </div>
          )}
        </div>
      );
    });
  };
  
  // Sử dụng hàm renderItems để hiển thị các items:
  return (
    <div className='menu-expand'>
      {renderItems(items)}
    </div>
  );
}

const ExpandContext = createContext<ExpandContextValue | null>(null);

MenuExpand.Provider = function MenuExpandProvider({ children }: { children: ReactNode }) {
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
