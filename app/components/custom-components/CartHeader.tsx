import React, {useState, useEffect, useRef} from 'react';
import {Suspense} from 'react';
import {Await } from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import { useCartHeader, CartHeaderExpand  } from './CartHeaderExpand'; 
import {CartMain} from '~/components/CartMain';

// custom
import iconcart from '~/assets/fonts/icons/icon-bag.svg';

type Viewport = 'desktop' | 'mobile';
interface CartHeaderProps {
    cart: Promise<CartApiQueryFragment | null>;
    openOverlayClick: () => void;
    closeOverlayClick: () => void;
}

export default function CartHeader({cart, openOverlayClick,closeOverlayClick }: CartHeaderProps) {

    const {open, close} = useCartHeader();
    const activeSearch = () => { 
      open('cart');
      openOverlayClick();
    }
    const closeSearchHeader = () => { 
      close();
      closeOverlayClick();
    }
  
    const cartRef = useRef<HTMLDivElement | null>(null); // Chỉ định rõ kiểu HTMLDivElement hoặc null
    // Sự kiện kích hoạt bên ngoài DOM
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        // Kiểm tra nếu nhấn vào ngoài search box và cartRef không phải là null
        if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
          closeSearchHeader();
        }
      };
  
      // Thêm event listener cho document
      document.addEventListener('mousedown', handleClickOutside);
  
      // Cleanup khi component unmount
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [closeSearchHeader]);


    return (
        <div className='cart-header' ref={cartRef}>
            <Suspense fallback={<CartHeaderBtn  count={null} />}>
                <Await resolve={cart}>
                    {(cart) => {
                        if (!cart) return <CartHeaderBtn count={0} />;
                        return <CartHeaderBtn 
                          openOverlayClick={openOverlayClick}
                          closeOverlayClick={closeOverlayClick}
                          count={cart.totalQuantity || 0} 
                        />;
                    }}
                </Await>
            </Suspense>
            <CartExpand cart = {cart} />
        </div>
        
    );
}

function CartHeaderBtn (
  {count, openOverlayClick, closeOverlayClick}: {
    count: number | null,
    openOverlayClick: () => void,
    closeOverlayClick: () => void,
  }) 
  {
    const {open} = useCartHeader();
    const {publish, shop, cart, prevCart} = useAnalytics();

    const openCartHeader = () =>{
      open('cart');
      openOverlayClick();
    }
  
    return (
      <a
        className="btn btn-cart"
        href="/cart"
        onClick={(e) => {
          e.preventDefault();
          openCartHeader();
          publish('cart_viewed', {
            cart,
            prevCart,
            shop,
            url: window.location.href || '',
          } as CartViewPayload);

        }}
      >
        <img src={iconcart} width={'20px'} />
        <span className='cart-badge'>{count === null ? <span>&nbsp;</span> : count}</span>
        
      </a>
    );
}

function CartExpand({cart}: {cart : Promise<CartApiQueryFragment | null>}) {
    return (
        <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
            {(resolvedCart) => {
              const totalQuantity = resolvedCart?.totalQuantity || 0; // Lấy giá trị totalQuantity từ cart
              return (
                  <CartHeaderExpand 
                    type="cart" 
                    heading="CART" 
                    count={totalQuantity}  // Truyền totalQuantity vào count
                  >
                    <CartMain cart={resolvedCart} layout="aside" />
                  </CartHeaderExpand>
              );
            }}
        </Await>
        </Suspense>
    );
  }
  