import { useState } from 'react';
import { ProductPrice } from '~/components/ProductPrice';
import { Image } from '@shopify/hydrogen';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAside } from '~/components/Aside';
import { AddToCartButton } from '~/components/AddToCartButton';
import { ProductModalVariantOptions } from './ProductModalVariantOptions';
import { Link } from '@remix-run/react';

// type Loading = 'loading' | 'idle' | 'submitting';

interface ModalProps {
  onClose: () => void;
  product: any;
  loading: boolean;
}

export function ProductModal({ onClose, product, loading }: ModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-overlay" />
        <div>Loading...</div>
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

  // Hàm xử lý việc chọn biến thể
  const handleVariantSelected = (variant: any | null) => {
    setSelectedVariant(variant);
  };

  return (
    <div className="modal product-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <button className='btn btn-close' onClick={onClose}>
          Close
        </button>

        <div className="product-modal__detail">
          {/* Hiển thị hình ảnh sản phẩm */}
          <Swiper className='product-image flex-auto' spaceBetween={50} slidesPerView={1}>
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
          </Swiper>

          <div className="content">
            <h2>{productItem.title}</h2>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
            <div className="product-form">
              {/* Gọi component ProductModalVariantOptions và truyền hàm handleVariantSelected */}
              <ProductModalVariantOptions
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
                      <ProductPrice
                        price={selectedVariant?.price}
                        // compareAtPrice={selectedVariant?.compareAtPrice}
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
                className="link-underline text-center"
              >
                <span className='link-hover'>
                  View product details
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
