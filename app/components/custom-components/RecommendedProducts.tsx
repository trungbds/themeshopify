import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  RecommendedProductsQuery,
  RecommendedProductItemQuery
} from 'storefrontapi.generated';

// Swiper
import { Navigation, Pagination as PaginationSwiper, Mousewheel, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';
import noImage from '~/assets/images/no-image-available.png';
import icondiscount from '~/assets/fonts/icons/icon-discount.svg';



export default function RecommendedProducts({
    products,
  }: {
    products: RecommendedProductsQuery  | null;
  }) {

    if (!products || !products.products.nodes.length) {
      return <p>No recommended products found.</p>;
    }

    return (
      <div className="recommended-products">
        <h2 className="recommended-products__title">Recommended</h2>
          <Swiper
            className = 'recommended-swiper'
            modules={[Navigation, PaginationSwiper,Mousewheel, Keyboard]}
            spaceBetween={8}
            slidesPerView='auto'
            navigation= {{
            prevEl: '.carousel-btn-prev.recommended-swiper__btn-prev',
            nextEl: '.carousel-btn-next.recommended-swiper__btn-next',
            
            }}
            pagination={{ 
                el: '.images-pagination',
                type: 'fraction' 
            }}

            breakpoints={{
              768: { // Trên 768px, không sử dụng cssMode
                cssMode: false,
              },
              0: { // Dưới 768px, bật cssMode
                  cssMode: true,
                  mousewheel: false, // Tắt cuộn bằng bánh xe chuột trên mobile
                  
              }
            }}
          >
            {products.products.nodes.map((product) => (
              <SwiperSlide>
                <RecommendedProductItem
                  product={product}
                />
              </SwiperSlide>
            ))}

            <div className="carousel-btn-prev recommended-swiper__btn-prev">
              <img src={iconchevronleft} alt="" width='24px' height='auto' />
            </div>
            <div className="carousel-btn-next recommended-swiper__btn-next">
              <img src={iconchevronright} alt=""  width='24px' height='auto'/>
            </div>

          </Swiper>
      </div>
    );
  }


  
function RecommendedProductItem ({product}:{product: RecommendedProductItemQuery}) {
  // Discount
  const DiscountsMetafield = product.collections.nodes;
  let DiscountMetafieldSelected: any | null = null;

  if (DiscountsMetafield && DiscountsMetafield.length > 0) {
    const filteredMetafields = DiscountsMetafield.filter(
      (collection : any) => collection.metafield !== null
    );

    if (filteredMetafields.length > 0) {
      DiscountMetafieldSelected = filteredMetafields.reduce(
        (max : any, collection: any) => {
          return parseInt(collection.metafield!.value) >
            parseInt(max.metafield!.value)
            ? collection
            : max;
        }
      );
    }
  }
  const { minVariantPrice } = product.priceRange;

  let discountedMinPrice: string | null = null;
  let title = '';

  if (DiscountMetafieldSelected) {
    const discountPercentage = parseFloat(DiscountMetafieldSelected.metafield.value) / 100;
    discountedMinPrice = (parseFloat(minVariantPrice.amount) * (1 - discountPercentage)).toFixed(2);
    title = DiscountMetafieldSelected.title;
  }


  return (
    <Link
      key={product.id}
      className="recommended-product link-primary"
      to={`/p/${product.handle}`}
      prefetch="intent"
    >
      {product.images.nodes[0] ? (
        <Image
          alt={product.title}
          aspectRatio="1/1"
          data={ product.images.nodes[0]}
          loading="lazy"
          sizes="(min-width: 45em) 20vw, 50vw"
        />
      ) : (
        <img
          src={noImage}
          alt={`No image available for ${product.title}`}
          width={'280'}
        />
      )}
      <h4 className='product-title link-hover'>{product.title}</h4>
      <div className='product-price'>
        {title && (
          <div className="discount-label inline-flex">
            {title}
          </div>
        )}

        <div className={`price-detail ${title ? 'discount' : ''}`}>
          {discountedMinPrice ? <Money data={{ amount: discountedMinPrice, currencyCode: minVariantPrice.currencyCode }} /> : <Money data={product.priceRange.minVariantPrice} />}
        </div>
      </div>
      
    </Link>
  );
}