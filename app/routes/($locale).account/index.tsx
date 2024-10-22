import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import iconlogout from '~/assets/fonts/icons/icon-logout.svg';


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
          
          <h1>{heading}</h1>
          <div className="page-sidebar">
            <AccountMenu />
          </div>
          <div className="page-content">
            <Outlet context={{customer}} />
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
      fontWeight: isActive ? 'bold' : undefined,
      color: isPending ? 'grey' : 'black',
    };
  }

  return (

    <nav className='account-nav' role="navigation">
      <NavLink to="/account/orders" style={isActiveStyle}>
        Orders  
      </NavLink>
      <NavLink to="/account/profile" style={isActiveStyle}>
        Profile  
      </NavLink>
      <NavLink to="/account/addresses" style={isActiveStyle}>
        Addresses  
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
