import {Await, Link} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {SearchHeaderExpand} from '~/components/custom-components/SearchHeaderExpand';
import { CartHeaderExpand } from '~/components/custom-components/CartHeaderExpand';

import { Breadcrumbs } from './custom-components';

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
            <Breadcrumbs isActive={true}/>
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

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
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

// Thieu Viewport
// function MenuCategoriesExpand ({
//   header,
//   publicStoreDomain,
// }: {
//   header: PageLayoutProps['header'];
//   publicStoreDomain: PageLayoutProps['publicStoreDomain'];
// }) {
//   return (
//     header.menu &&
//     header.shop.primaryDomain?.url && (
//       <MenuExpand type="mobile" heading="Categories">
//         <HeaderMenu
//           menu={header.menu}
//           viewport="mobile"
//           primaryDomainUrl={header.shop.primaryDomain.url}
//           publicStoreDomain={publicStoreDomain}
//         />
//       </MenuExpand>
//     )
//   );
// }

// function ProductItemBoxModal({product}: {product: PageLayoutProps['product']}) {
//   return (
//     <BoxModal type="product" heading="Quick Add">
//       <Suspense fallback={<p>Loading product ...</p>}>
//         <Await resolve={product}>
//           {(product) => {
//             return <ProductBoxModal product={product}  />;
//           }}
//         </Await>
//       </Suspense>
//     </BoxModal>
//   );
// }