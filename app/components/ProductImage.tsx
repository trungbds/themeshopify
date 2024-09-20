import React, { useEffect, useState , useRef } from "react";

import type {ProductVariantFragment, ProductFragment} from 'storefrontapi.generated';
import { Image as HydrogenImage, Pagination }  from '@shopify/hydrogen';
import { Image as HydrogenReactImage } from '@shopify/hydrogen-react';


// LightGallery
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';


// Swiper
import { Navigation,  Pagination as PaginationSwiper  } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';







export function ProductImage({
  currentImage, images
}: {
  currentImage: ProductVariantFragment['image'];
  images:  ProductFragment['images'];

}) {

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); 

  const imageList = images.edges.map(edge => edge.node);



  // lightgallery
  const onInit = () => {
    // console.log('lightGallery has been initialized');
  };
  const lightGallery = useRef<any>(null);

  // swiper
  const swiperProductImages = useSwiper();
  const swiperRef = useRef(null);

  
  // start
  if (imageList.length === 0) {
    return <div className="product-image">No images available</div>;
  }
  return (
    <div className="product-image">
        <LightGallery
            speed={150}
            closeOnTap = {false}
            download  = {false}
            licenseKey = {'000000000000000'}
            plugins={[lgThumbnail, lgZoom]}
            selector={'.img-lightbox, .all-lightbox'}
            onInit={(detail) => {
              lightGallery.current = detail.instance;
            }}
            // onAfterSlide={(slideCurrent) => {
            //   const newIndex = slideCurrent.index;
            //   setActiveIndex(newIndex);
            //   if (swiperRef.current && isLightboxOpen) {
            //     swiperRef.current.slideTo(newIndex); // Chỉ cập nhật Swiper khi Lightbox đang mở
            //   }
            // }}
            // onBeforeOpen ={() => setIsLightboxOpen(true)} // Mở lightbox
            // onBeforeClose ={() => setIsLightboxOpen(false)} // Đóng lightbox
        >
          <Swiper
            modules={[Navigation, PaginationSwiper]}
            spaceBetween={50}
            slidesPerView={1}
            navigation= {{
              prevEl: '.carousel-btn-prev',
              nextEl: '.carousel-btn-next',
              
            }}
            pagination={{ 
              el: '.images-pagination',
              type: 'fraction' 
            }}
          >
            {imageList.map( (img) => (
              <SwiperSlide>
                <a 
                  className="img-lightbox"
                  data-src={img.url}
                  key={img.id}
                >
                  <HydrogenImage
                    key={img.id}
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
              <img src={iconchevronleft} alt="" width='24px' height='auto' />
            </div>
            <div className="carousel-btn-next">
              <img src={iconchevronright} alt=""  width='24px' height='auto'/>
            </div>
          </Swiper>
        </LightGallery>  
        
        <div className="carousel-helpers">
          {/* not working */}
          <button className="all-lightbox btn-primary"> View all </button>
          {/* -- not working */}
          <div className="images-pagination"></div>
        </div>
        
    </div>

  );
}
