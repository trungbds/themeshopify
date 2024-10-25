import { useEffect, useState } from 'react';
import { ProductPrice } from '~/components/ProductPrice';
import { Image, Money } from '@shopify/hydrogen';
import { useAside } from '~/components/Aside';
import { AddToCartButton } from '~/components/AddToCartButton';
import { ProductModalVariantOptions } from './ProductModalVariantOptions';
import { Link } from '@remix-run/react';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

import iconclose from '~/assets/fonts/icons/icon-close.svg';

// Swiper
import { Navigation,  Pagination as PaginationSwiper, FreeMode} from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';
import iconwishlist from '~/assets/fonts/icons/icon-wishlist.svg';
import iconwishlistactived from '~/assets/fonts/icons/icon-wishlist__active.svg';

import iconforward from '~/assets/fonts/icons/icon-forward.svg';
import iconback from '~/assets/fonts/icons/icon-back.svg';

import { ProductPriceV3 } from './ProductPriceV3';
import { RatingCount } from '~/routes/p/$handle/RatingCount';

// type Loading = 'loading' | 'idle' | 'submitting';

interface ModalProps {
  onClose: () => void;
  product: any;
  loading: boolean;
}

export function ProductModal({ onClose, product, loading }: ModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
   // Hàm xử lý việc chọn biến thể
  const handleVariantSelected = (variant: any | null) => {
    setSelectedVariant(variant);
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-overlay" />
        <div>Loading product...</div>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }
  const productItem = product.product;

  // image
  const images = productItem.images;
  const imageList = images.edges.map((edge:any) => edge.node);

  // product form
  const { open } = useAside();

   //  iconwishlist
   const [iconWishlist, setIconWishlist] = useState(iconwishlist);
   const handleWistlistClick = () => {
     setIconWishlist(prevIcon =>
       prevIcon === iconwishlist ? iconwishlistactived : iconwishlist
     );
   };

  // Discount
  const DiscountsMetafield = productItem.collections?.nodes;
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

  // Add to cart price

  

  return (
    <div className=" product-modal">
      <div className="product-modal__header">
        <button className='btn btn-close link-primary' onClick={onClose}>
          
          <img src={iconclose} alt="close" />
        </button>

        <div className="product-modal__title">
          <h4 className='title'>{productItem.title}</h4>
          <Link
            className='btn'
            to={`/p/${productItem.handle}`}
          >
            <span>Details</span>
            <img src={iconforward} alt="close"/>

          </Link>


        </div>
      </div>
      

      <div className="product-modal__detail">
        {/* Hiển thị hình ảnh sản phẩm */}
        <div className="carousel">
      
        <Swiper 
          className='product-images flex-auto' 
          modules={[Navigation, PaginationSwiper, FreeMode]}
          spaceBetween={16} 
          slidesPerView={1}
          navigation= {{
            prevEl: '.carousel-btn-prev',
            nextEl: '.carousel-btn-next',
            
          }}
          pagination={{ 
            el: '.images-pagination',
            type: 'fraction' 
          }}

          breakpoints={{
            768: { // Trên 768px, không sử dụng cssMode
              cssMode: false,
            },
            0: { 
              slidesPerView : 'auto',
              cssMode: true,
              freeMode: true, 
              spaceBetween: 4,
              freeModeMomentum: true,  // Thêm quán tính khi trượt nhanh
              freeModeMomentumBounce: true,

            }
          }}

        >
          {imageList.map((img: any) => (
            <SwiperSlide key={img.id}>
              <a data-src={img.url}>
                <Image
                  alt={img.altText || 'Product Image'}
                  src={img.url}
                  aspectRatio="1/1"
                  sizes="(min-width: 45em) 50vw, 100vw"
                  loading="lazy"
                />
              </a>
            </SwiperSlide>
          ))}
          <div className="carousel-btn-prev">
            <img src={iconback} alt="" width='24px' height='auto' />
          </div>
          <div className="carousel-btn-next">
            <img src={iconforward} alt=""  width='24px' height='auto'/>
          </div>
          <div className="images-pagination"></div>
        </Swiper>

        </div>
        <div className="content">
    
          <div className="product-header">
            <div className='product-title'>
              <h2>{productItem.title}</h2>
              <div className='brand'> Brand: <strong>{productItem.vendor}</strong></div>
            </div>
            <button className='btn-wishlist' onClick={handleWistlistClick}>
              <img src={iconWishlist}  width={'20px'} />
            </button>
          </div>

          <RatingCount />

          <ProductPriceV3 
            discountSelected={DiscountMetafieldSelected}
            priceRange={productItem.priceRange}
            priceShow={selectedVariant?.price}
          />

          {/* <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          /> */}


          <div className="product-form">
            {/* Gọi component ProductModalVariantOptions và truyền hàm handleVariantSelected */}
            <ProductModalVariantOptions
              handle ={productItem.handle}
              options={productItem.options}
              variants={productItem.variants.nodes}
              onVariantSelected={handleVariantSelected}
            />
            <AddToCartButton
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              onClick={() => {
                onClose;
                open('cart');
              }}
              lines={
                selectedVariant
                  ? [
                      {
                        merchandiseId: selectedVariant.id,
                        quantity: 1,
                      },
                    ]
                  : []
              }
            >
                {selectedVariant?.availableForSale ? (
                  <>
                    Add to cart
                    <AddToCartPrice 
                      price = {selectedVariant?.price}
                      discountSelected = {DiscountMetafieldSelected}
                    />
                  </>
                ) : (
                  <>
                    Add to cart
                    <div className="product-price"></div>
                  </>
                )}
                
            </AddToCartButton>
            <Link
              to={`/p/${productItem.handle}`}
              className="btn link-underline text-center product-link"
            >
              <span className='link-hover'>
                View product details
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



function AddToCartPrice ({
  price, 
  discountSelected
}:{
  price?: MoneyV2;
  discountSelected?: any | null;
}) {
  let discountedPriceShow: string | null = null;
  if (discountSelected) {
    const discountPercentage = parseFloat(discountSelected.metafield.value) / 100;

    discountedPriceShow = price
      ? (parseFloat(price.amount) * (1 - discountPercentage)).toFixed(2)
      : null;
  }
  return (
    <div className="product-price">
      <div className="after-discount">
        {discountedPriceShow && price ? (
          <Money data={{ amount: discountedPriceShow, currencyCode: price.currencyCode }} />
        ) : price ? (
          <Money data={price} />
        ) : (
          <div>No price available</div> 
        )}
      </div>
    </div>
  );
}

