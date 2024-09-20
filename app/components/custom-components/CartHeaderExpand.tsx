import {createContext, type ReactNode, useContext, useState} from 'react';
import iconclose from '~/assets/fonts/icons/icon-close.svg';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type CartHeaderContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

export function CartHeaderExpand({
  children,
  heading,
  type,
  count
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
  count: number;
}) {
  const {type: activeType, close} = useCartHeader();
  const expanded = type === activeType;

  return (
    <div
      className={`cart-expand ${expanded ? 'expanded' : ''}`}
    >
      <div className='cart-expand__header flex items-center justify-between'>
        <h3>Your cart: <strong>{count} items</strong> </h3>
        <button className='close reset' onClick={close}>
          <img src={iconclose} width='24px' />
        </button>
      </div>
      {children}
    </div>
  );
}

const CartHeaderContext = createContext<CartHeaderContextValue | null>(null);

CartHeaderExpand.Provider = function CartHeaderProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <CartHeaderContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </CartHeaderContext.Provider>
  );
};

export function useCartHeader() {
  const expand = useContext(CartHeaderContext);
  if (!expand) {
    throw new Error('useCartHeader must be used within an CartHeaderProvider');
  }
  return expand;
}
