import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  // const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  // return defer({...deferredData, ...criticalData})
  return defer({...criticalData})
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
    storefront.query(PRODUCT_MODAL_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
   

  ]);

  return {
    product
  };
}

// product modal
export const PRODUCT_MODAL_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    title
    unitPrice {
      amount
      currencyCode
    }
      
  }
` as const;

export const PRODUCT_MODAL_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    images(first: 20) {
      edges {
        node {
          id
          url
          altText
        }
      }
    }
    vendor
    handle
    options {
      name
      values
    }

    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }

    
  }
  ${PRODUCT_MODAL_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_MODAL_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_MODAL_FRAGMENT}
` as const;

export const PRODUCT_MODAL_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
        
      }
        
    }
  }
  ${PRODUCT_MODAL_VARIANT_FRAGMENT}
` as const;

export const VARIANTS_PRODUCT_MODAL_QUERY = `#graphql
  ${PRODUCT_MODAL_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
