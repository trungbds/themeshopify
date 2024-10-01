import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import type { ProductRecentlyViewedFragment } from 'storefrontapi.generated';

import {Image, Money} from '@shopify/hydrogen';

// Swiper
import { Navigation,  Pagination as PaginationSwiper  } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';
import noImage from '~/assets/images/no-image-available.png';
import icondiscount from '~/assets/fonts/icons/icon-discount.svg';

interface RecentlyViewedProductsProps {
    viewedProducts: ProductRecentlyViewedFragment[];
  }

// Component RecentlyViewedProducts
export default function RecentlyViewedProducts({ viewedProducts }: RecentlyViewedProductsProps) {

  if (viewedProducts.length === 0) {
    return null
  }

  return (
    <div className="recently-viewed">
        <h2 className="recently-viewed__title">Recently viewed</h2>
            <Swiper
                className='recently-viewed__carousel'
                key = 'recently-viewed-swiper'
                modules={[Navigation, PaginationSwiper]}
                spaceBetween={8}
                slidesPerView={7}
                navigation= {{
                prevEl: '.carousel-btn-prev.recently-viewed-swiper__btn-prev',
                nextEl: '.carousel-btn-next.recently-viewed-swiper__btn-next',
            }}
            pagination={{ 
                el: '.images-pagination',
                type: 'fraction' 
            }}
            >
                {viewedProducts.map(product => (
                    <SwiperSlide>
                        <RecentlyViewedProductItem product={product} />
                        {/* {JSON.stringify(product,null,2 ) } */}
                    </SwiperSlide>
                ))}

                <div className="carousel-btn-prev recently-viewed-swiper__btn-prev">
                    <img src={iconchevronleft} alt="" width='24px' height='auto' />
                </div>
                <div className="carousel-btn-next recently-viewed-swiper__btn-next">
                    <img src={iconchevronright} alt=""  width='24px' height='auto'/>
                </div>

            </Swiper>
    </div>
  );
}

function RecentlyViewedProductItem ({product}:{product: ProductRecentlyViewedFragment}) {
    // Discount
    const DiscountsMetafield = product.collections?.nodes;
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
    const { price } = product;
  
    let discountedMinPrice: string | null = null;
    let title = '';
  
    if (DiscountMetafieldSelected) {
      const discountPercentage = parseFloat(DiscountMetafieldSelected.metafield.value) / 100;
      discountedMinPrice = (parseFloat(price.amount) * (1 - discountPercentage)).toFixed(2);
      title = DiscountMetafieldSelected.title;
    }
  
  
    return (
      <Link
        key={product.id}
        className="recommended-product link-primary"
        to={`/p/${product.handle}`}
        prefetch="intent"
      >
        {product.image ? (
          <Image
            alt={product.title}
            aspectRatio="1/1"
            data={ product.image}
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
            { discountedMinPrice ? <Money data={{ amount: discountedMinPrice, currencyCode: price.currencyCode }} /> : <Money data={price} />}
          </div>
        </div>
        
      </Link>
    );
}
