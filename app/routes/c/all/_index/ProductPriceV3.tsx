import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import icondiscount from '~/assets/fonts/icons/icon-discount.svg';

export function ProductPriceV3({
  discountSelected,
  priceRange
}: {
  discountSelected?: any | null;
  priceRange?: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  } | null;
}) {
  if (!priceRange) return null;

  const { minVariantPrice, maxVariantPrice } = priceRange;
  const isSamePrice = minVariantPrice.amount === maxVariantPrice.amount;

  let discountedMinPrice: string | null = null;
  let discountedMaxPrice: string | null = null;
  let title = '';

  if (discountSelected) {
    const discountPercentage = parseFloat(discountSelected.metafield.value) / 100;
    discountedMinPrice = (parseFloat(minVariantPrice.amount) * (1 - discountPercentage)).toFixed(2);
    
    if (!isSamePrice) {
      discountedMaxPrice = (parseFloat(maxVariantPrice.amount) * (1 - discountPercentage)).toFixed(2);
    }

    title = discountSelected.title;
  }

  return (
    <div className="product-price">

      {title && (
        <div className="discount-label inline-flex">
          <img src={icondiscount} alt="" width="16px" />
          {title}
        </div>
      )}

      <div className="price-detail">
        {/* Nếu có chiết khấu, hiển thị giá cũ với gạch ngang */}
        {discountSelected && (
          <div>
            <div className="before-discount">
              <s>
                <div>
                  <Money data={minVariantPrice} />
                </div>
              </s>
              {!isSamePrice && (
                <>
                  {' - '}
                  <s>
                    <div>
                      <Money data={maxVariantPrice} />
                    </div>
                  </s>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hiển thị giá mới (sau khi chiết khấu) hoặc giá thông thường nếu không có chiết khấu */}
          {discountedMinPrice ? (
            <div className='after-discount'>
              <Money data={{ amount: discountedMinPrice, currencyCode: minVariantPrice.currencyCode }} />
              {!isSamePrice && discountedMaxPrice && (
                <>
                  {' - '}
                  <Money data={{ amount: discountedMaxPrice, currencyCode: maxVariantPrice.currencyCode }} />
                </>
              )}
            </div>
          ) : (
            <div className='after-discount'>
              <Money data={minVariantPrice} />
              {!isSamePrice && (
                <>
                  {' - '}
                  <Money data={maxVariantPrice} />
                </>
              )}
            </div>
          )}

      </div>
    </div>
  );
}
