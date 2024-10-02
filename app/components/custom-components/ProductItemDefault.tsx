import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import type {ProductItemFragment} from 'storefrontapi.generated';
import noVariantColor from '~/assets/images/no-variant-color.png';
import { ProductPriceV3 } from '~/routes/c/all/_index/ProductPriceV3';
import iconcart from '~/assets/fonts/icons/icon-cart.svg';


interface ProductItemProps {
  product: ProductItemFragment; 
  // colorVariants: Array<{
  //   swatch: {
  //     color: string | null;
  //     image: {
  //       transformedSrc: string | null; 
  //     };
  //   };
  // }>;
  colorVariants: any[]; 
  loading?: 'eager' | 'lazy';
  type?: 'default' | 'minus';
  onSelectProduct: (handle: string)=> void;
}

export function ProductItemDefault({
  product,
  colorVariants,
  loading,
  type, 
  onSelectProduct, 
}: ProductItemProps ) {

  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  //  Discount
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

  return (
    <div className="product-item">
      <Link prefetch="intent" to={variantUrl}>
      {product.featuredImage ? (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      ) : (
        <img
          src={noVariantColor}
          alt={`No image available for ${product.title}`}
        />
      )}
        <RenderColorVariants colorVariants={colorVariants} />
        <div className='product-item__header'>
          <h4 title={product.title}>{product.title}</h4>
        </div>
          <ProductPriceV3 
            discountSelected={DiscountMetafieldSelected}
            priceRange={product.priceRange}
          />
      </Link>

      {/* Thêm nút Add to Cart */}
      <button
        className = "btn btn-quickadd" 
        onClick={() => onSelectProduct && onSelectProduct(product.handle)}
      >
          <img src={iconcart}/>
          Add to Cart
      </button>
    </div>
  );
}

function RenderColorVariants({ colorVariants }: { colorVariants: any[] }) {
  // Lọc những tập con có ít nhất một optionValues.swatch khác null
  const validVariants = colorVariants.filter(variant =>
    variant.optionValues.some(option => option.swatch !== null)
  );

  // Flatten tất cả các optionValues từ các tập con hợp lệ (bao gồm cả những cái có swatch === null)
  const flattenedVariants = validVariants.flatMap(variant => variant.optionValues);

  // Get the number of valid variant colors
  const numberOfVariantColors = flattenedVariants.length;

  // Nếu không có biến thể hợp lệ, không hiển thị gì
  if (numberOfVariantColors === 0) {
    return <div className="color-variants" />;
  }

  return (
    <div className="color-variants">
      {flattenedVariants.slice(0, 5).map((variant, index) => {
        // Check if the variant has an image or color, otherwise handle swatch null cases
        if (variant.swatch?.image?.previewImage?.transformedSrc) {
          return (
            <img
              key={index}
              src={variant.swatch.image.previewImage.transformedSrc}
              alt={`Color variant ${index + 1}`}
            />
          );
        } else if (variant.swatch?.color) {
          return (
            <div
              key={index}
              style={{ backgroundColor: variant.swatch.color }}
              className="color-swatch"
            ></div>
          );
        } else {
          return (
            <div key={index} className="no-color-swatch">
              <img
                key={index}
                src={noVariantColor}
                alt={`Color variant ${index + 1}`}
              />
            </div>
          );
        }
      })}
      {/* Render the number of remaining variants if more than 5 */}
      {numberOfVariantColors > 5 && (
        <span>{numberOfVariantColors - 5}+</span>
      )}
    </div>
  );
}
