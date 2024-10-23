import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import icondiscount from '~/assets/fonts/icons/icon-discount.svg';

export function ProductPriceV3({
  discountSelected,
  priceRange,
  priceShow
}: {
  discountSelected?: any | null;
  priceRange?: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  } | null;
  priceShow?: MoneyV2
}) {
  if (!priceRange) return null;

  

  const { minVariantPrice, maxVariantPrice } = priceRange;
  const isSamePrice = minVariantPrice.amount === maxVariantPrice.amount;

  let discountedMinPrice: string | null = null;
  let discountedMaxPrice: string | null = null;
  let discountedPriceShow: string | null = null;
  let title = '';

  if (discountSelected) {
    const discountPercentage = parseFloat(discountSelected.metafield.value) / 100;
    discountedMinPrice = (parseFloat(minVariantPrice.amount) * (1 - discountPercentage)).toFixed(2);

    discountedPriceShow = priceShow
      ? (parseFloat(priceShow.amount) * (1 - discountPercentage)).toFixed(2)
      : null;
    
    if (!isSamePrice) {
      discountedMaxPrice = (parseFloat(maxVariantPrice.amount) * (1 - discountPercentage)).toFixed(2);
    }

    // title = discountSelected.title;
     title = `- ${discountSelected.metafield.value}%`;
  }

  return (
    <div className="product-price">

      

      <div className="price-detail">
        {/* Nếu có chiết khấu, hiển thị giá cũ với gạch ngang */}

        {priceShow ? (
          <>
            {discountSelected ? (
              <>
                <s className="before-discount">
                  <Money data={priceShow} />
                </s>
                <div className="after-discount">
                  {discountedPriceShow && (
                    <Money data={{ amount: discountedPriceShow, currencyCode: priceShow.currencyCode }} />
                  )}
                </div>
              </>
            ) : (
              <div className="after-discount">
                <Money data={priceShow} />
              </div>
            )}
          </>
        ) : (
          
          <>
            {discountSelected && (
              <>
                
                <div className="before-discount">
                  {title && (
                    <div className="discount-label inline-flex">
                      {/* <img src={icondiscount} alt="" width="16px" /> */}
                      {title}
                    </div>
                  )}
                  <s>
                      <Money data={minVariantPrice} />
                  </s>

                  {/* more */}
                  {/* {!isSamePrice && (
                    <>
                      {' - '}
                      <s>
                        <Money data={maxVariantPrice} />
                      </s>
                    </>
                  )} */}
                </div>
              </>
              
            )}

            {/* Hiển thị giá mới (sau khi chiết khấu) hoặc giá thông thường nếu không có chiết khấu */}
            {discountedMinPrice ? (
              <div className="after-discount">
                <Money data={{ amount: discountedMinPrice, currencyCode: minVariantPrice.currencyCode }} />
                {/* more */}
                {/* {!isSamePrice && discountedMaxPrice && (
                  <>
                    {' - '}
                    <Money data={{ amount: discountedMaxPrice, currencyCode: maxVariantPrice.currencyCode }} />
                  </>
                )} */}
              </div>
            ) : (
              <div className="after-discount">
                <Money data={minVariantPrice} />
                {!isSamePrice && (
                  <>
                    {' - '}
                    <Money data={maxVariantPrice} />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
