import { Suspense } from 'react';
import { Await, NavLink } from '@remix-run/react';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

import iconship from '~/assets/fonts/icons/icon-ship.svg';
import iconmoneyback from '~/assets/fonts/icons/icon-moneyback.svg';
import iconsupport247 from '~/assets/fonts/icons/icon-support247.svg';
import iconregularsale from '~/assets/fonts/icons/icon-regularsale.svg';



export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {

  const {shop} = header;

  return (
    <footer className="footer">
      <Suspense>
        <Await resolve={footerPromise}>
          {(footer) => (
            <>
              {footer?.menu && header.shop.primaryDomain?.url && (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                  shop = {shop}
                />
              )}
            </>
          )}
        </Await>
      </Suspense>
    </footer>
    
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
  shop
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: string;
  publicStoreDomain: string;
  shop: HeaderQuery['shop']
}) {
  const items = (menu || FALLBACK_FOOTER_MENU).items;
  const hasMoreThanThreeItems = items.length > 3;

  console.log('SHOP', shop);
  const logoUrl: string = shop.brand?.logo?.image?.url ?? '';

  return (
    <>
      {hasMoreThanThreeItems && (
        <>
          <ShopFeature />
          <section className="footer-mainmenu">
            <div className="container">
              <div className='grid grid-cols-12 gap-4'>

                <div className="col-span-2">
                  <NavLink 
                    className='shop-brand'
                    prefetch="intent" 
                    to="/" 
                    end
                  >
                    <img src={logoUrl} alt={shop.name} />
                  </NavLink>
                  <div className="copyright">
                    © Copyright,
                    <NavLink prefetch="intent" to="/" end>
                      {shop.name}
                    </NavLink>
                    <p>
                      All right reserved
                    </p>
                  </div>
                </div>

                {items.slice(0, 3).map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    primaryDomainUrl={primaryDomainUrl}
                    publicStoreDomain={publicStoreDomain}
                  />
                ))}

                <div className="sm:col-span-4 md:col-span-4">
                  <div className=''>
                    <button>Track order</button>
                    <div>Returns and exchanges</div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </>

        
      )}


      {hasMoreThanThreeItems && (
        <section className="footer-submenu">
          <div className="container">
            {items.slice(3).map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                primaryDomainUrl={primaryDomainUrl}
                publicStoreDomain={publicStoreDomain}
              />
            ))}
          </div>
        </section>
      )}

      {!hasMoreThanThreeItems && (
        <section className="footer-mainmenu">
          <div className="container">
            {items.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                primaryDomainUrl={primaryDomainUrl}
                publicStoreDomain={publicStoreDomain}
              />
            ))}
          </div>
        </section>
      )}

    </>
    
  );
}

function MenuItem({
  item,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  item: any;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  if (!item.url) return null;

  // If the URL is internal, strip the domain
  const url = item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
    ? new URL(item.url).pathname
    : item.url;

  const isExternal = !url.startsWith('/');

  const renderedItem = isExternal ? (
    <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
      {item.title}
    </a>
  ) : (
    <NavLink
      end
      key={item.id}
      prefetch="intent"
      to={url}
      className='menu-item menu-item__title'
    >
      {item.title}
    </NavLink>
  );

  // Check if item.items exists and is an array with elements
  if (Array.isArray(item.items) && item.items.length > 0) {
    return (
      <div className="col-span-2">
        <div key={item.id} className='menu-item__group'>
          {renderedItem}
          <div className="submenu">
            {item.items.map((subItem: any) => {
              if (!subItem.url) return null;

              const subUrl = subItem.url.includes('myshopify.com') ||
                            subItem.url.includes(publicStoreDomain) ||
                            subItem.url.includes(primaryDomainUrl)
                ? new URL(subItem.url).pathname
                : subItem.url;

              const isSubExternal = !subUrl.startsWith('/');

              return isSubExternal ? (
                <a
                  href={subUrl}
                  key={subItem.id}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {subItem.title}
                </a>
              ) : (
                <NavLink
                  end
                  key={subItem.id}
                  prefetch="intent"
                  to={subUrl}
                  className='menu-item'
                >
                  {subItem.title}
                </NavLink>
              );
            })}
          </div>
        </div>

      </div>
      
    );
  }

  return renderedItem;
}

function ShopFeature(){
  return (
    <section className='shop-feature'>
      <div className='container'>
        <div className="grid grid-cols-4 gap-4">

        <div className="col-span-1">
            <div className='shop-feature__detail'>
              <img src={iconship} alt="ship and return" />
              <div className='content'>
                <h3>Free Shipping & Returns</h3>
                <p>
                  Shop with confidence and have your favorite electronics delivered right to your doorstep without any additional cost
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1">

            <div className='shop-feature__detail'>
              <img src={iconmoneyback} alt="money back" />
              <div className='content'>
                <h3>Money Back Guarantee</h3>
                <p>
                  If you're not completely satisfied with your purchase, we'll make it right. No questions asked.
                </p>
              </div>
            </div>

          </div>

          <div className="col-span-1">
            <div className='shop-feature__detail'>
              <img src={iconsupport247} alt="online support 24/7" />
              <div className='content'>
                <h3>Online Support 24/7</h3>
                <p>
                  Need help with your electronics? Get in touch with us anytime, anywhere, and let's get your tech sorted.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className='shop-feature__detail'>
                <img src={iconregularsale} alt="Regular Sales" />
                <div className='content'>
                  <h3>Regular Sales</h3>
                  <p>
                    If you're not completely satisfied with your purchase, we'll make it right. No questions asked.
                  </p>
                </div>
              </div>
            
          </div>
          
        </div>
      </div>
    </section>
  )
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
