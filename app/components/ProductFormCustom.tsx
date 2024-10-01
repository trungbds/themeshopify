import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import { CartForm, type OptimisticCartLine } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

import React, { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import { type VariantOption, VariantSelector } from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { Image } from '@shopify/hydrogen';
import Quantity from './custom-components/helpers/Quantity';
import iconcheckcircle from '~/assets/fonts/icons/icon-check-circle.svg';

// Cập nhật ProductFormCustom để truyền options vào ProductVariantOptions
export function ProductFormCustom({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const { open } = useAside();

  // Tạo mảng options với isVariantColor
  const options = product.options.map(option => {
    const hasColor = option.optionValues.some(value => value.swatch && value.swatch.color);
    return {
      name: option.name,
      values: option.values,
      isVariantColor: hasColor
    };
  });

  // Số lượng mặc định
  const [quantity, setQuantity] = useState(1);

  // Cập nhật số lượng về mặc định mỗi khi selectedVariant thay đổi
  useEffect(() => {
    setQuantity(1); 
  }, [selectedVariant]);

  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={options}
        variants={variants}
        productPath="/p"
      >
        {({ option }) => {
          const isVariantColor = options.find(opt => opt.name === option.name)?.isVariantColor || false;
          return <ProductVariantOptions key={option.name} option={option} isVariantColor={isVariantColor} />;
        }}
      </VariantSelector>

      <div className='purchase-method'>
        <div className="purchase-method__detail">
          <h3 className='title'>
            Delivery: <span>Ship Economy</span> 
          </h3>
          <p className='description'>
            5 to 8 business days, shipping cost calculated at checkout!
          </p>
        </div>
        <img src={iconcheckcircle} className="icon-check"/>
      </div>

      {/* Component Quantity */}
      <Quantity 
        quantityAvailable={selectedVariant?.quantityAvailable ?? 1}
        quantity={quantity} // Truyền quantity vào component Quantity
        onQuantityChange={setQuantity} // Hàm thay đổi quantity
      />

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity, // Sử dụng quantity từ state
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

// Thay thế biến thể "Color" mặc định thành hình ảnh
function ProductVariantOptions({
  option,
  isVariantColor
}: {
  option: VariantOption;
  isVariantColor: boolean;
}) {
  const [selectedValue, setSelectedValue] = useState(option.values[0]?.value || '');

  return (
    <div className="product-options" key={option.name}>
      <h5>
        {option.name}: <span>{selectedValue}</span>
      </h5>
      <div className="product-options-grid">
        {option.values.map(({ value, isAvailable, isActive, to, variant }) => {
          const image = variant?.image;
          const linkClassName = [
            'product-options-item',
            isActive ? 'active' : '',
            isVariantColor ? 'variant-color' : '',
          ].filter(Boolean).join(' ');

          return (
            <Link
              className={isAvailable? `${linkClassName} isAvailable` : `${linkClassName}`}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              to={to}
              style={{
                border: isActive ? '1px solid #000' : '',
              }}
              onClick={() => {
                setSelectedValue(value);
              }}
            >
              {isVariantColor && image ? (
                <>
                  <Image
                    alt={image.altText || 'Color option image'}
                    aspectRatio="1/1"
                    data={image}
                    loading="lazy"
                    height={72}
                    width={72}
                    style={{
                      opacity: isAvailable ? 1 : 0.5,
                    }}
                  />
                  <div className='btn-tooltip'>
                    <div className='tooltip-value'>{value}</div>
                    <div className="tooltip-arrow"></div>
                  </div>
                </>
                
              ) : (
                <span 
                  style={{
                    opacity: isAvailable ? 1 : 0.5,
                  }}
                > {value} </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
