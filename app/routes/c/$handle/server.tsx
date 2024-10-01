const PRODUCT_ITEM_FRAGMENT = `#graphql
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

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
export const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys 
    $reverse: Boolean 
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey, 
        reverse: $reverse
      ){
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
          
        filters {
          id
          label
          presentation
          type
          values {
            input
            label
            count
            id
          }
        }
          
      }
    }
  }
` as const;

export const COLOR_VARIANTS_COLLECTION_QUERY = `#graphql
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


const MENU_COLLECTION_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

export const MENU_COLLECTION = `#graphql
  query MenuCollection(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    menu(handle: "main-menu") {
      ...Menu
    }
  }
  ${MENU_COLLECTION_FRAGMENT}
` as const;
