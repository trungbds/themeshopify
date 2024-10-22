import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from '@remix-run/react';
import iconlogout from '~/assets/fonts/icons/icon-logout.svg';
import { IconDefaultPerson } from '~/components/custom-components/icons/default/IconDefaultPerson';
import { IconDefaultOrder } from '~/components/custom-components/icons/default/IconDefaultAddress copy 3';
import { IconDefaultAddress } from '~/components/custom-components/icons/default/IconDefaultAddress';
import { IconDefaultWishlist } from '~/components/custom-components/icons/default/IconDefaultWishlist';




export async function loader({context}: LoaderFunctionArgs) {
  return json(
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}




export default function AccountLayout() {

  const customer = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    orders: [
      {
        id: '12345',
        status: 'Shipped',
        items: [
          {
            name: 'Product 1',
            quantity: 2,
            price: 99.99,
          },
        ],
      },
    ],
  }
  const heading = 'customer'
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
      color: isActive ? '#0046be' : '#000',
    };
  }

  return (
    <nav className="account-nav" role="navigation">
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

      <Logout />
    </nav>
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
