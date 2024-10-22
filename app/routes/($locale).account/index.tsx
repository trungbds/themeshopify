import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import iconlogout from '~/assets/fonts/icons/icon-logout.svg';
import { IconDefaultPerson } from '~/components/custom-components/icons/default/IconDefaultPerson';
import { IconDefaultOrder } from '~/components/custom-components/icons/default/IconDefaultAddress copy 3';
import { IconDefaultAddress } from '~/components/custom-components/icons/default/IconDefaultAddress';
import { IconDefaultWishlist } from '~/components/custom-components/icons/default/IconDefaultWishlist';


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
      color: isActive ? '#0046be' : '#000',
    };
  }

  return (
    <nav className="account-nav" role="navigation">
      <NavLink to="/account/profile">
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

      <NavLink to="/account/orders">
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

      <NavLink to="/account/addresses">
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

      <NavLink to="/account/wishlist">
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

      <NavLink to="/account/help">
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

      <NavLink to="/account/faqs">
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
