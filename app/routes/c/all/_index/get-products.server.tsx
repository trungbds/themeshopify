export const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
    collections(first: 10) {
      nodes {
        metafield(key: "discount_fixed", namespace: "sale") {
          type
          value
        }
        title
      }
    }
  }
` as const;

export const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;

// get color varuant
export const COLOR_VARIANTS_QUERY = `#graphql
  query ColorVariants($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        options {
          optionValues {
            swatch {
              color
              image {
                previewImage {
                  transformedSrc(crop: CENTER, maxHeight: 60, maxWidth: 60)
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

