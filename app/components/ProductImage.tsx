import React, { useState, useRef, useEffect } from "react";
import { Image as HydrogenImage } from '@shopify/hydrogen';
import 'swiper/css/thumbs';

// Swiper
import { Navigation, Pagination as PaginationSwiper, Mousewheel, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';

import iconchevronrightwhite from '~/assets/fonts/icons/icon-chevron-right-white.svg';
import iconchevronleftwhite from '~/assets/fonts/icons/icon-chevron-left-white.svg';
import iconclosetwhite from '~/assets/fonts/icons/icon-close-white.svg';


// Component Modal cho chuỗi hình ảnh
function FullscreenModal({ isOpen, onClose, startIndex, images }) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cuộn đến hình ảnh bắt đầu trong modal nếu chỉ số được chỉ định
    if (modalContentRef.current && startIndex !== null) {
      const selectedImage = modalContentRef.current.children[startIndex];
      if (selectedImage) {
        selectedImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [startIndex]);

  const scrollToImage = (index: number) => {
    // Hàm cuộn đến hình ảnh tương ứng khi click vào số
    if (modalContentRef.current) {
      const selectedImage = modalContentRef.current.children[index];
      if (selectedImage) {
        selectedImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-carousel--modal">
      <button className="btn close-modal-btn" onClick={onClose}>
        <img src={iconclosetwhite} alt="Đóng modal" />
      </button>

      <div className="product-carousel--header"></div>

      <div className="product-carousel--content" ref={modalContentRef} style={{ overflowY: 'auto', maxHeight: '100vh' }}>
        <div className="image-list">
          {images.map((img, idx) => (
            <HydrogenImage
              key={idx}
              alt={img.altText || 'product carousel'}
              src={img.url}
              aspectRatio="auto"
              loading="lazy"
              width="auto"
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          ))}
        </div>
      </div>

      {/* Danh sách các số tương ứng với hình ảnh */}
      <div className="image-number-list">
        {images.map((_, idx) => (
          <button
            key={idx}
            className="image-number-btn"
            onClick={() => scrollToImage(idx)} // Cuộn đến hình ảnh khi click
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}


export function ProductImage({ currentImage, images }: { currentImage: any, images: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const imageList = images.edges.map(edge => edge.node);
  const swiperRef = useRef<SwiperType | null>(null);
  const hasImages = imageList.length > 0 || currentImage;

  console.log(images)


  useEffect(() => {
    if (swiperRef.current && currentImage) {
      swiperRef.current.slideTo(0); // Đặt lại Swiper về slide đầu tiên
    }
  }, [currentImage]);

  const openModal = (index: number) => {
    setStartIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStartIndex(null);
  };

  if (!hasImages) {
    return <div className="product-images">Không có hình ảnh nào</div>;
  }

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.initialized) {
      swiperRef.current.update(); // Buộc Swiper cập nhật khi có sự thay đổi
    }
  }, [images, currentImage]); // Kiểm tra khi images hoặc currentImage thay đổi

  return (
    <div className="product-images">
      {hasImages && (
        <>
          <div className="product-carousel">
            <Swiper
              modules={[Navigation, PaginationSwiper, Mousewheel, Keyboard]}
              className="product-carousel__images"
              spaceBetween={32}
              slidesPerView={1}
              navigation={{
                prevEl: '.carousel-btn-prev',
                nextEl: '.carousel-btn-next',
              }}
              pagination={{
                el: '.images-pagination',
                type: 'fraction',
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                768: {
                  cssMode: false,
                },
                0: {
                  cssMode: true,
                  mousewheel: false,
                },
              }}
            >
              {currentImage && currentImage.image && (
                <SwiperSlide>
                  <a
                    className="img-lightbox"
                    onClick={() => openModal(0)} // Mở modal với hình ảnh đầu tiên
                  >
                    <HydrogenImage
                      key={currentImage.image.id}
                      alt={`${currentImage.selectedOptions[0].name}: ${currentImage.selectedOptions[0].value}`}
                      src={currentImage.image.url}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 50vw, 100vw"
                      loading="lazy"
                    />
                  </a>
                </SwiperSlide>
              )}

              {imageList.map((img, index) => (
                <SwiperSlide key={img.id}>
                  <a
                    className="img-lightbox"
                    onClick={() => openModal(index + 1)} // Mở modal với hình ảnh được click
                  >
                    <HydrogenImage
                      alt={img.altText || 'Hình ảnh sản phẩm'}
                      src={img.url}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 50vw, 100vw"
                      loading="lazy"
                    />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="product-carousel--nav">
            <div className="carousel-btn-prev">
              <img src={iconchevronleftwhite} alt="" width="24px" height="auto" />
            </div>
            <div className="carousel-btn-next">
              <img src={iconchevronrightwhite} alt="" width="24px" height="auto" />
            </div>
          </div>
        </>
      )}

      <div className="carousel-helpers">
        <button className="all-lightbox btn-primary">Xem tất cả</button>
        <div className="images-pagination"></div>
      </div>

      {/* Modal hiển thị chuỗi hình ảnh */}
      <FullscreenModal
        isOpen={isModalOpen}
        onClose={closeModal}
        startIndex={startIndex}
        images={imageList}
      />
    </div>
  );
}
