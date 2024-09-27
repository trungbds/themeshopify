import React, { useState } from 'react';
import {Link} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import { Image }  from '@shopify/hydrogen';

export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {open} = useAside();
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
        productPath= '/p'
      >
        
        {({ option }) => {
            return <ProductVariantOptions key={option.name} option={option} />;
          }}
      </VariantSelector>
      <br />

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
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

// Thay thế biến thể "Color" mặc định thành hình ảnh 
function ProductVariantOptions({ option}:{option: VariantOption} ) {

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
            option.name === 'Color' ? 'variant-color' : '',  // Thêm class "variant-color" khi điều kiện thỏa mãn
          ].filter(Boolean).join(' ');  // Loại bỏ các lớp rỗng và kết hợp các lớp thành chuỗi

          return (
            <Link
              className={linkClassName}  // Sử dụng className đã được tạo
              key={option.name + value}  // Sử dụng template literals để đảm bảo key duy nhất
              prefetch="intent"
              preventScrollReset
              to={to}
              style={{
                border: isActive ? '' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
              onChange={() => {
                setSelectedValue(value);
              }}
            >
              {option.name === 'Color' && image ? (
                <Image
                  alt={image.altText || 'Color option image'}  // Cung cấp giá trị cho thuộc tính alt
                  aspectRatio="1/1"
                  data={image}
                  loading="lazy"
                  height={74}
                  width={74}
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