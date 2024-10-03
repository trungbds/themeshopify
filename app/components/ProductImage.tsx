import React, { useEffect, useRef } from "react";

import type { ProductVariantFragment, ProductFragment } from 'storefrontapi.generated';
import { Image as HydrogenImage } from '@shopify/hydrogen';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

// Swiper
import { Navigation, Pagination as PaginationSwiper, Mousewheel, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper'; // Import kiểu Swiper

import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';

export function ProductImage({
  currentImage,
  images,
}: {
  currentImage: ProductVariantFragment | null | undefined; // Sửa lại kiểu cho currentImage
  images: ProductFragment['images'];
}) {
  const imageList = images.edges.map(edge => edge.node);
  const lightGallery = useRef<any>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const hasImages = imageList.length > 0 || currentImage; // Kiểm tra xem có hình ảnh hay không

  // Cập nhật Swiper khi currentImage thay đổi
  useEffect(() => {
    if (swiperRef.current && currentImage) {
      swiperRef.current.slideTo(0); // Cập nhật chỉ số của Swiper
    }
  }, [currentImage, imageList]); // Chạy khi currentImage thay đổi

  // Start
  if (!hasImages) {
    return <div className="product-image">No images available</div>;
  }

  console.log(currentImage); 

  return (
    <div className="product-image">
      <LightGallery
        speed={150}
        closeOnTap={false}
        download={false}
        licenseKey={'000000000000000'}
        plugins={[lgThumbnail, lgZoom]}
        selector={'.img-lightbox'}
        onInit={(detail) => {
          lightGallery.current = detail.instance;
        }}
      >
        {hasImages && (
          <Swiper
            modules={[Navigation, PaginationSwiper, Mousewheel, Keyboard]}
            className="product-carousel"
            spaceBetween={32}
            slidesPerView={1}
            navigation={{
              prevEl: '.carousel-btn-prev',
              nextEl: '.carousel-btn-next',
            }}
            pagination={{
              el: '.images-pagination',
              type: 'fraction'
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper; // Gán giá trị cho swiperRef
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
            {/* Kiểm tra và in ra currentImage nếu nó tồn tại */}
            {currentImage && currentImage.image && ( // Kiểm tra xem currentImage có tồn tại và có trường image
              <SwiperSlide>
                <a 
                  className="img-lightbox"
                  data-src={currentImage.image.url} // Sửa đường dẫn đến ảnh
                  key={currentImage.image.id} // Sửa key
                >
                  <HydrogenImage
                    key={currentImage.image.id} // Sửa key
                    alt={`${currentImage.selectedOptions[0].name}: ${currentImage.selectedOptions[0].value}` || 'Product Image'} // Sửa alt text
                    src={currentImage.image.url} // Sửa đường dẫn đến ảnh
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 50vw, 100vw"
                    loading="lazy"
                  />
                </a>
              </SwiperSlide>
            )}

            {imageList.map(img => (
              <SwiperSlide key={img.id}>
                <a 
                  className="img-lightbox"
                  data-src={img.url}
                >
                  <HydrogenImage
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
              <img src={iconchevronright} alt="" width='24px' height='auto' />
            </div>
          </Swiper>
        )}
      </LightGallery>

      <div className="carousel-helpers">
        <button className="all-lightbox btn-primary"> View all </button>
        <div className="images-pagination"></div>
      </div>
    </div>
  );
}
