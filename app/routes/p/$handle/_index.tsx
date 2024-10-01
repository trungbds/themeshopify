import React, {useState, useEffect} from 'react';
import {Suspense} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
} from '@shopify/hydrogen';

import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';
import {ProductImage} from '~/components/ProductImage';
import {ProductFormCustom} from '~/components/ProductFormCustom'

import { PRODUCT_QUERY, RECOMMENDED_PRODUCTS_QUERY, VARIANTS_QUERY } from './server';

import iconwishlist from '~/assets/fonts/icons/icon-wishlist.svg';
import iconwishlistactived from '~/assets/fonts/icons/icon-wishlist__active.svg';
import icondropdown from '~/assets/fonts/icons/icon-dropdown.svg';

import { RatingCount } from './RatingCount';

import {ProductPriceV2} from '~/components/custom-components/ProductPriceV2'; 
import RecommendedProducts from '~/components/custom-components/RecommendedProducts';
import RecentlyViewedProducts from './RecentlyViewedProducts';
import type {
  ProductRecentlyViewedFragment
} from 'storefrontapi.generated';


type ImageNode = {
  id: string;
  url?: string;
  altText?: string;
  width?: string;
  height?: string;
};

type VariantImage = {
  id: string;
  image: ImageNode | null; // Cập nhật kiểu ở đây
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

export const handle = {
  breadcrumbType :'product'
}



export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData})
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
    
  }
  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }
  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );
  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }
  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

    const recommendedproducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    variants,
    recommendedproducts
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}



export default function Product() {
  const {product, variants, recommendedproducts} = useLoaderData<typeof loader>();
  
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  const {vendor, title, descriptionHtml, images} = product;
  const sku = product.variants.nodes[0]?.sku || '--';

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

  //  iconwishlist
  const [iconWishlist, setIconWishlist] = useState(iconwishlist);
  const handleWistlistClick = () => {
    setIconWishlist(prevIcon =>
      prevIcon === iconwishlist ? iconwishlistactived : iconwishlist
    );
  };

  const [viewedProducts, setViewedProducts] = useState<ProductRecentlyViewedFragment[]>([]);
 
  // viewed product
  useEffect(() => {
    // Lấy danh sách sản phẩm đã xem từ localStorage
    const storedProducts: ProductRecentlyViewedFragment[] = JSON.parse(localStorage.getItem('viewedProducts') || '[]') as ProductRecentlyViewedFragment[];
  
    // Kiểm tra nếu sản phẩm hiện tại đã tồn tại trong danh sách thì không thêm nữa
    const productExists = storedProducts.some(item => item.id === product.id);
  
    if (!productExists) {
      // Tạo một danh sách mới bằng cách thêm sản phẩm mới vào đầu danh sách
      const updatedViewedProducts = [
        {
          id: product.id,
          title: product.title,
          handle: product.handle,
          image: product.images?.edges[0]?.node || null,
          price: product.priceRange?.minVariantPrice
            ? {
                amount: product.priceRange.minVariantPrice.amount,
                currencyCode: product.priceRange.minVariantPrice.currencyCode,
              }
            : { amount: "0", currencyCode: "USD" },
          collections: product.collections || [],
        },
        ...storedProducts.filter(item => item.id !== product.id) // Xóa sản phẩm hiện tại nếu đã có trong danh sách
      ];
  
      // Giới hạn số lượng sản phẩm đã xem
      const limitedViewedProducts = updatedViewedProducts.slice(0, 20); // Giữ lại tối đa 20 sản phẩm
  
      // Lưu danh sách đã cập nhật vào localStorage
      localStorage.setItem('viewedProducts', JSON.stringify(limitedViewedProducts));
  
      // Cập nhật state
      setViewedProducts(limitedViewedProducts);
    } else {
      // Nếu sản phẩm đã tồn tại, chỉ cần cập nhật state từ localStorage
      setViewedProducts(storedProducts);
    }
  }, [product]);

  

  // Thêm ảnh từ variant 


  return (
    <div className="product">
      <section className='product-page__section'>
        <div className="container">
          <div className="product-sku">SKU: <span>{sku}</span></div>
          <div className="product-detail">
            
            <div className="product-content">
              {selectedVariant?.image && (
                <ProductImage
                  currentImage={selectedVariant}
                  images={images} 
                  key = {product.handle}
                />
              )}
              <div className='product-description'>
                <div className='product-description__header'>
                  <h3 className='title btn btn-title'> Description</h3>
                  <button className='btn icon btn-icon'>
                    <img src={icondropdown} alt="Description"/>
                  </button>
                </div>
                <div className='product-description__content'
                  dangerouslySetInnerHTML={{__html: descriptionHtml}} 
                />
              </div>
            </div>
            <div className="product-main">
              <div className="product-header">
                <div className='product-title'>
                  <div className='brand'> Brand: <strong>{vendor}</strong>  </div>
                  <h1>{title}</h1>
                  <RatingCount />
                </div>
                <button className='btn-wishlist' onClick={handleWistlistClick}>
                  <img src={iconWishlist}  width={'20px'} />
                </button>
              </div>

              <ProductPriceV2
                discountSelected={DiscountMetafieldSelected}
                // priceRange={product.priceRange}
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />

              <Suspense
                fallback={
                  <ProductFormCustom
                    product={product}
                    selectedVariant={selectedVariant}
                    variants={[]}
                  />
                }
              >
                <Await
                  errorElement="There was a problem loading product variants"
                  resolve={variants}
                >
                  {(data) => {
                    return (
                      <ProductFormCustom
                        product={product}
                        selectedVariant={selectedVariant}
                        variants={data?.product?.variants.nodes || []}
                      />
                    );
                  }}
                </Await>
              </Suspense>
              
            </div>
          </div>
        </div>
      </section>

      <section className='recommended-products'>
        <div className="container">
          <Suspense fallback={<div>Loading...</div>}>
            <Await
              errorElement="There was a problem loading recommended products"
              resolve={recommendedproducts}
            >
              {(resolvedProducts) => (
                <RecommendedProducts products={resolvedProducts} />
              )}
            </Await>
          </Suspense>
          
        </div>
      </section>

      <section className='recently-viewed__section'>
        <div className="container">
          <RecentlyViewedProducts viewedProducts={viewedProducts.filter(item => item.id !== product.id)} />
        </div>
      </section>
      
      {/* Analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}


