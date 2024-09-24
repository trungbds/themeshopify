import {Await, useRouteLoaderData, Link} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {MetaFunction} from '@remix-run/react';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import type {RootLoader} from '~/root';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartForm} from '@shopify/hydrogen';
import {CartLineItem} from '~/components/CartLineItem';
import {useCartHeader} from '~/components/custom-components/CartHeaderExpand';
import iconchevrondown from '~/assets/fonts/icons/icon-chevron-down.svg';
import iconpaymentlist from '~/assets/fonts/icons/icon-paymentlist.svg';



type CartLayout = 'page' | 'aside';

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity! > 0;

  return (
    <>
      <div className='grid grid-cols-12 gap-4 justify-center'>
        <div className="col-span-2"></div>
        <div className="col-span-4">

          <CartDiscounts discountCodes={cart.discountCodes} />
          <CalculateShippingFees />

          <div className="cart-details">
            <div aria-labelledby="cart-lines" className='cart-lines'>
              <ul>
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </ul>
            </div>
            {cartHasItems && 
              (
                <div className='Subtotal-cart-page'>
                  <div className="cart-subtotal">
                    <div className='title'>
                      Subtotal<span> ({cart.totalQuantity} items)</span>
                    </div>
                    <div className='amount'>
                      {cart.cost?.subtotalAmount?.amount ? (
                        <Money data={cart.cost?.subtotalAmount} />
                      ) : (
                        '--'
                      )}
                    </div>
                  </div>
                </div>
              )
            }
          </div>

        </div>
        <div className="col-span-1"></div>
        <div className="col-span-3">
          {cartHasItems && <CartSummary cart={cart} layout={layout} />}
        </div>
        <div className="col-span-2"></div>
        <div className="col-span-8 w-full mx-auto"><CartEmpty hidden={linesCount} layout={layout} /></div>

        
      </div>
    </>
  )
}

export default function Cart() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;


  return (
    <section className='cart-page'>
      <div className="container">
        <div className="cart">
          <Suspense fallback={<p>Loading ...</p>}>
            <Await
              resolve={rootData.cart}
              errorElement={<div>An error occurred</div>}
            >
              {(cart) => {
                return (
                  <>
                    {/* {JSON.stringify(cart, null, 2)} */}
                    <CartMain layout="page" cart={cart} />
                  </>
                ) 
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </section>
  );
}



function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useCartHeader();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you 
        started!
      </p>
      <br />
      <Link to="/c/all" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}


//----------------------------------------------------------------
import { Money, type OptimisticCart} from '@shopify/hydrogen';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="cart-subtotal">
        <div className='title'>
          Subtotal
          <small>Tax included and shipping<br />calculated at checkout</small>
        </div>
        <div className='amount'>
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost?.subtotalAmount} />
          ) : (
            '--'
          )}
        </div>
      </div>
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}
function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a 
        className='btn-checkout'
        href={checkoutUrl}  
        target="_self"
      >
        Check out
      </a>
      <div className="cart-page__payment">
        <h3>Payment accept</h3>
        <ul className="payment-methods">
          <li><img src={iconpaymentlist} alt="payment-methods"/></li>
        </ul>
      </div>
      
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className='form-render'>
          <input type="text" name="discountCode" placeholder="Discount code" />
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className='cart-page__discounts'>
      <div className='cart-page__discounts--header' onClick={toggleForm}>
        <h3 className='title'>Apply Coupons & TiktokWeb's Cash</h3>
        <img src={iconchevrondown} className={`icon ${isFormOpen ? 'open' : 'closed'}`} />
        
      </div>
      {isFormOpen && (
        <div className="cart-page__discount--form">
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.DiscountCodesUpdate}
            inputs={{
              discountCodes: discountCodes || [],
            }}
          >
            {children}
          </CartForm>
        </div>
      )}
      
    </div>
    
  );
}

function CalculateShippingFees(){
  return (
    <div className='cart-page__shipping'>
      <div className='cart-page__shipping--header'>
        <h3 className='title'>Shipping to ( Enter your Address )</h3>
      </div>
      <div className='calculate-content'>
        <p className='shipping-time'>Estimated delivery: Thu Aug 22 - Mon Aug 26</p>
        <span className='shipping-cost'> free </span>
      </div>


    </div>


  )
}



