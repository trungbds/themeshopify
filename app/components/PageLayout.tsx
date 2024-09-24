import React from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {SearchHeaderExpand} from '~/components/custom-components/SearchHeaderExpand';
import {CartHeaderExpand} from '~/components/custom-components/CartHeaderExpand';
import {Breadcrumbs} from './custom-components';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  
   
}: PageLayoutProps) {

  return (
    <Aside.Provider>
      <SearchHeaderExpand.Provider>
        <CartHeaderExpand.Provider>
          
          <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
          
          {header && (
            <Header
              header={header}
              cart={cart}
              isLoggedIn={isLoggedIn}
              publicStoreDomain={publicStoreDomain}
            />
          )}

          <main className='main'>
            <Breadcrumbs isActive={true} />
            {children}
          </main>

          <Footer
            footer={footer}
            header={header}
            publicStoreDomain={publicStoreDomain}
          />

        </CartHeaderExpand.Provider>
      </SearchHeaderExpand.Provider>        
    </Aside.Provider>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}