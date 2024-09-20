import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import icondiscount from '~/assets/fonts/icons/icon-discount.svg'; 

export function ProductPriceV2({
  price,
  compareAtPrice,
  discountSelected,
  priceRange
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  discountSelected?: any | null;
  priceRange?: any | null; 
}) {  // Biến mặc định để hiển thị
  let finalPrice = price;
  let title = '';

  // Kiểm tra các điều kiện
  if (discountSelected && price) {
    const discountPercentage = parseFloat(discountSelected.metafield.value) / 100;
    const discountedAmount = (parseFloat(price.amount) * (1 - discountPercentage)).toFixed(2);

    if (compareAtPrice) {
      // Trường hợp có discountSelected và compareAtPrice
      const originalPriceAmount = parseFloat(compareAtPrice.amount);
      const discountValue = (100 - (parseFloat(discountedAmount) / originalPriceAmount) * 100).toFixed(0);
      title = `save ${discountValue}% off`;
      finalPrice = { amount: discountedAmount, currencyCode: price.currencyCode };
    } else {
      // Trường hợp có discountSelected nhưng không có compareAtPrice
      title = discountSelected.title;
      finalPrice = { amount: discountedAmount, currencyCode: price.currencyCode };
      compareAtPrice = price; // Gán giá ban đầu làm giá cũ
    }
  } else if (!discountSelected && compareAtPrice && price) {
    // Trường hợp không có discountSelected nhưng có compareAtPrice
    const originalPriceAmount = parseFloat(compareAtPrice.amount);
    const discountValue = (100 - (parseFloat(price.amount) / originalPriceAmount) * 100).toFixed(0);
    title = `save ${discountValue}% off`;
    finalPrice = price;
  } else if (!discountSelected && !compareAtPrice && price) {
    // Trường hợp không có discountSelected và không có compareAtPrice
    finalPrice = price;
    title = '';
  }

  return (
    <div className="product-price">
      {title && 
        <div className='discount-label inline-flex'>
          <img src={icondiscount} alt="" width='16px' />
          {title}
        </div>
      }
      <div className='price-detail'>
        {finalPrice ? <Money data={finalPrice} /> : <span>Price unavailable</span>}
        {compareAtPrice && (
          <s>
            <Money data={compareAtPrice} />
          </s>
        )}
      </div>
      
    </div>
  );
}