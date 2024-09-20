import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import type {ProductItemFragment} from 'storefrontapi.generated';
import noVariantColor from '~/assets/images/no-image.png';

interface ProductItemProps {
  product: ProductItemFragment; 
  colorVariants: Array<{
    swatch: {
      color: string | null;
      image: {
        transformedSrc: string | null; 
      };
    };
  }>;
  loading?: 'eager' | 'lazy';
  onAddToCart: () => void;
}

export function ProductItem({
  product,
  colorVariants,
  loading,
  onAddToCart, // Thêm prop để điều khiển mở modal
}: ProductItemProps ) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  return (
    <div className="product-item">
      <Link prefetch="intent" to={variantUrl}>
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
        <RenderColorVariants colorVariants={colorVariants} />
        <h4>{product.title}</h4>
        <small>
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </Link>

      {/* Thêm nút Add to Cart */}
      <button onClick={onAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

function RenderColorVariants({ colorVariants }: ProductItemProps['colorVariants']) {
  
  //Error '.leight'
  const numberOfVariantColors = colorVariants.length;

  // Nếu chỉ có một biến thể và cả `transformedSrc` lẫn `color` đều không có giá trị thì không hiển thị gì
  if (numberOfVariantColors === 1 && !colorVariants[0].swatch.image.transformedSrc && !colorVariants[0].swatch.color) {
    return <div className="color-variants" />;
  }

  return (
    <div className="color-variants">
      {colorVariants.slice(0, 5).map((variant, index) => {
        if (variant.swatch.image.transformedSrc) {
          return <img key={index} src={variant.swatch.image.transformedSrc} alt={`Color variant ${index + 1}`} />;
        } else if (variant.swatch.color) {
          return <div key={index} style={{ backgroundColor: variant.swatch.color }} className="color-swatch"></div>;
        } else {
          return <img key={index} src={noVariantColor} alt="No color variant" />;
        }
      })}
      {numberOfVariantColors > 5 && <span>{numberOfVariantColors - 5}+</span>}
    </div>
  );
}