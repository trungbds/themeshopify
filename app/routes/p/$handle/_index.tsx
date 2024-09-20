import React, {useState} from 'react';
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
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductFormCustom} from '~/components/ProductFormCustom';

import { PRODUCT_QUERY, VARIANTS_QUERY } from './server';

import iconwishlist from '~/assets/fonts/icons/icon-wishlist.svg';
import iconwishlistactived from '~/assets/fonts/icons/icon-wishlist__active.svg';
import { RatingCount } from './RatingCount';

//custom components
import {ProductPriceV2} from '~/components/custom-components/ProductPriceV2'; 



export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

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
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    variants,
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
  const {product, variants} = useLoaderData<typeof loader>();
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


  return (
    <div className="product">
      <div className="product-sku">SKU: <span>{sku}</span></div>
      <div className="product-detail">
        
        <div className="product-content">
          {selectedVariant?.image && (
            <ProductImage
              currentImage={selectedVariant?.image}
              images={images} 
            />
          )}
          <div className='product-description'>
            <h2> Description</h2>
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
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

          <br />
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


