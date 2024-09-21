import { Suspense } from 'react';
import { Await, Link, NavLink } from '@remix-run/react';
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
import iconpackagewhite from '~/assets/fonts/icons/icon-package-white.svg';
import iconpaymentlist from '~/assets/fonts/icons/icon-paymentlist.svg';
import iconsociallist from '~/assets/fonts/icons/icon-sociallist.svg';


import { ButtonOptionSelect } from './custom-components/ButtonOptionSelect';





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
                  <div className='footer-right__area'>

                    <Link
                      prefetch="intent"
                      to={'/account/orders'}
                      className='btn btn-primary btn-dark'
                    >
                      <img src={iconpackagewhite} alt="Track order" />
                      <span>Track order</span>
                    </Link>
                    
                    <div className='live-chat'>
                      If You Have any Questions<br/>Please Contact Us 24/7:
                      <a className='' href="_blank"><strong>Live chat</strong></a>
                    </div>

                  </div>

                </div>

                <div className='sm:col-span-12 md:col-span-12 '>
                  <div className='footer-block__ulti flex gap-16'>
                    <ButtonOptionSelect 
                      label="Language"
                      selectedDefault ="English"
                    />
                    
                    <div className='footer-block__payment'>
                      <h3>Payment accept</h3>
                      <ul className="payment-methods">
                        <li>
                          <Link
                            to = '/'
                          >
                            <img src={iconpaymentlist} alt="" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                    
                    <div className='footer-block__socical'>
                      <h3>Follow us</h3>
                      <ul className="payment-methods">
                        <li>
                          <Link
                            to = '/'
                          >
                            <img src={iconsociallist} alt="" />
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="footer-block__newsletter">
                      <h3 className="footer-block__heading inline-richtext">
                        Subscribe to <br/>
                        Our Newsletter
                      </h3>
                      <NewsLetter />
                    </div>

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

function NewsLetter() {
  return (
    <form className="footer__newsletter newsletter-form">
      <input type="hidden" name="form_type" value="customer" />
      <input type="hidden" name="utf8" value="✓" />
      <input type="hidden" name="contact[tags]" value="newsletter" />

      <div className="newsletter-form__field-wrapper">
        <div className="field">
          <input
            id="NewsletterForm--sections--17168244539587__footer"
            type="email"
            name="contact[email]"
            className="field__input"
            aria-required="true"
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="email"
            aria-describedby="ContactFooter-success"
            placeholder="Email"
            required
          />
          <button
            type="submit"
            className="newsletter-form__button field__button"
            name="commit"
            id="Subscribe"
            aria-label="Subscribe"
          >
            <svg
              viewBox="0 0 14 10"
              fill="none"
              aria-hidden="true"
              focusable="false"
              className="icon icon-arrow"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      
      <h3 className="newsletter-form__message newsletter-form__message--success form__message" id="ContactFooter-success" tabIndex={-1} autoFocus>
        <svg aria-hidden="true" focusable="false" className="icon icon-success" viewBox="0 0 13 13">
          <path
            d="M6.5 12.35C9.73087 12.35 12.35 9.73086 12.35 6.5C12.35 3.26913 9.73087 0.65 6.5 0.65C3.26913 0.65 0.65 3.26913 0.65 6.5C0.65 9.73086 3.26913 12.35 6.5 12.35Z"
            fill="#428445"
            stroke="white"
            strokeWidth="0.7"
          />
          <path d="M5.53271 8.66357L9.25213 4.68197" stroke="white" />
          <path d="M4.10645 6.7688L6.13766 8.62553" stroke="white" />
        </svg>
        Thanks for subscribing
      </h3>
    </form>

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
