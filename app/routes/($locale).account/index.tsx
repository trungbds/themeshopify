import { useState } from 'react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import iconlogout from '~/assets/fonts/icons/icon-logout.svg';
import { IconDefaultPerson } from '~/components/custom-components/icons/default/IconDefaultPerson';
import { IconDefaultOrder } from '~/components/custom-components/icons/default/IconDefaultOrder';
import { IconDefaultAddress } from '~/components/custom-components/icons/default/IconDefaultAddress';
import { IconDefaultWishlist } from '~/components/custom-components/icons/default/IconDefaultWishlist';
import { IconDefaultHome } from '~/components/custom-components/icons/default/IconDefaultHome';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return json(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <section>
      <div className="container">
        <div className="account">
          <h1 className='title'>{heading}</h1>

          <div className="account-page">
            <div className="page-sidebar">
              <AccountMenu />
            </div>
            <div className="page-content">
              <Outlet context={{customer}} />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

function AccountMenu() {

  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return {
      color: isActive ? '#0046be' : '',
    };
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('');

  const handleActiveLink = (content: string, isActive: boolean) => {
    if (isActive) {
      setActiveContent(content); // Cập nhật nội dung NavLink khi nó active
    }
  };

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  return (
    <>
    <button className="account-nav__mobile menu-toggle" onClick={toggleMenu}>
      Menu mobile{activeContent}
    </button>
    <nav className={`account-nav ${menuOpen ? 'open' : ''}`} role="navigation">
      <div className='group-large'>

        <NavLink 
          to="/accountstyle/home"
        >
          {({ isActive, isPending }) => (
            <>
              <IconDefaultHome 
                color={isActiveStyle({ isActive, isPending }).color }
              />
              <span
                style={{ color: isActiveStyle({ isActive, isPending }).color || '#000' }}
              >
                Home
              </span>
            </>
          )}
        </NavLink>

        
        <NavLink to="/accountstyle/orders">
          {({ isActive, isPending }) => (
            <>
              <IconDefaultOrder
                color={isActiveStyle({ isActive, isPending }).color || '#000'}
              />
              <span
                style={{ color: isActiveStyle({ isActive, isPending }).color || '#000' }}
              >
                Orders
              </span>
            </>
          )}
        </NavLink>
        <NavLink to="/accountstyle/profile">
          {({ isActive, isPending }) => (
            <>
              <IconDefaultPerson 
                color={isActiveStyle({ isActive, isPending }).color || '#000'}
              />
              <span
                style={{ color: isActiveStyle({ isActive, isPending }).color || '#000' }}
              >
                Profile
              </span>
            </>
          )}
        </NavLink>
        <NavLink to="/accountstyle/addresses">
          {({ isActive, isPending }) => (
            <>
              <IconDefaultAddress 
                color={isActiveStyle({ isActive, isPending }).color || '#000'}
              />
              <span
                style={{ color: isActiveStyle({ isActive, isPending }).color || '#000' }}
              >
                Addresses
              </span>
            </>
          )}
        </NavLink>
        <NavLink to="/accountstyle/wishlist">
          {({ isActive, isPending }) => (
            <>
              <IconDefaultWishlist 
                color={isActiveStyle({ isActive, isPending }).color || '#000'}
              />
              <span
                style={{ color: isActiveStyle({ isActive, isPending }).color || '#000' }}
              >
                Wishlist
              </span>
            </>
          )}
        </NavLink>
      </div>

      <div className='group-medium'>
        <NavLink to="/accountstyle/help">
          {({ isActive, isPending }) => (
            <>
              <span
                style={{ color: isActiveStyle({ isActive, isPending }).color || '#000' }}
              >
                Help Center
              </span>
            </>
          )}
        </NavLink>

        <NavLink to="/accountstyle/faqs">
          {({ isActive, isPending }) => (
            <>
              <span
                style={{ color: isActiveStyle({ isActive, isPending }).color || '#000' }}
              >
                FAQs
              </span>
            </>
          )}
        </NavLink>
      </div>
      <Logout />
    </nav>
    </>
    
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <img src={iconlogout} alt="" />
      <button type="submit">Sign out</button>
    </Form>
  );
}
