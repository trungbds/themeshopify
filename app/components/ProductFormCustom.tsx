import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import { CartForm, type OptimisticCartLine } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

import React, { useState } from 'react';
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

  console.log('selectedVariant',selectedVariant); 

  const options = product.options.map(option => {
    const hasColor = option.optionValues.some(value => value.swatch && value.swatch.color);

    return {
      name: option.name,
      values: option.values,
      isVariantColor: hasColor
    };
  });

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
      
      <Quantity 
        quantityAvailable={selectedVariant?.quantityAvailable ?? 0}
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
                  quantity: 1,
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
  isVariantColor: boolean;  // Thay đổi: Thêm isVariantColor vào props
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
            isVariantColor ? 'variant-color' : '', // Sử dụng isVariantColor thay vì option.name === 'Color'
          ].filter(Boolean).join(' ');

          return (
            <Link
              className={linkClassName}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              to={to}
              style={{
                border: isActive ? '2px solid black' : '2px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
              onClick={() => {
                setSelectedValue(value);
              }}
            >
              {isVariantColor && image ? (  // Kiểm tra isVariantColor và image
                <Image
                  alt={image.altText || 'Color option image'}  // Cung cấp giá trị cho thuộc tính alt
                  aspectRatio="1/1"
                  data={image}
                  loading="lazy"
                  height={72}
                  width={72}
                />
              ) : (
                value
              )}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}
