import queries from './queries.json';

const handleTD = queries.collectionsschema.todayinteresting[0].id; 
const handleIS = queries.collectionsschema.idealseasons[0].id; 


// Hàm tạo các collection queries dựa trên dữ liệu JSON
function generateCollectionQueries(collectionsSchema: { [key: string]: { id: string, index: number }[] }) {
  const result: string[] = [];
  
  // Duyệt qua từng nhóm collections
  for (const [groupName, collections] of Object.entries(collectionsSchema)) {
    // Duyệt qua từng collection trong nhóm
    collections.forEach((collection, index) => {
      // Tạo tên cho collection dựa trên nhóm và chỉ số
      const collectionName = `${groupName}${index + 1}`;
      
      // Tạo phần tử query cho collection
      result.push(`
        ${collectionName}: collection(id: "${collection.id}") {
          id
          handle
          image {
            url
            id
            altText
            height
            width
          }
          title
          description
        }
      `);
    });
  }

  return result.join('\n');
}

// Tạo query từ dữ liệu JSON
const collectionQueries = generateCollectionQueries(queries.collectionsschema);

// ----------------------------------------------------------------

export const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections (first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;


export const RECOMMENDED_PRODUCTS_HOMEPAGE_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;


// QUERY COLLECTIONS 
const HOMEPAGE_COLLECTION_TYPE_V1 = `#graphql
  fragment CollectionsByMetafeld on Collection {
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
` as const;

export const HOMEPAGE_COLLECTIONS_RENDER = `#graphql
  query HomepageCollections(
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    ${collectionQueries}
  }
` as const;

// QUERY HOMEPAGE_BESTSELLER_LIST
export const HOMEPAGE_BESTSELLER_LIST = `#graphql
  query HomepageBestSellerList(
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
      menu(handle: "main-menu") {
        itemsCount
        items {
          id
          title
          url
          resourceId
          resource {
            ... on Collection {
              id
              handle
              image {
                url(
                  transform: { crop: CENTER, maxWidth: 240, maxHeight: 240 }
                )
              }
              
            }
          }
        }
      }
    }
` as const;

// QUERY HOMEPAGE_BESTSELLER_LIST
export const TODAY_INTERSTING_ITEM = `#graphql
  query TodayInteresting(
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: "${handleTD}") {
      id
      title
      description
      products(first: 10) {
        nodes {
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
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
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
      }
    }
  }
` as const;

// QUERY IDEAL_FOR_SEASONS
export const IDEAL_FOR_SEASONS = `#graphql
  query IdealSeasons(
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(id: "${handleIS}") {
      id
      title
      description
      image {
        url
        altText
        height
        width
      }
      metafield(key: "images", namespace: "idealforseason") {
        id
        references(first: 10) {
          nodes {
            ... on MediaImage {
              id
              image {
                url
                height
                altText
                width
              }
            }
          }
        }
      } 
    }
  }
` as const;

// QUERY IDEAL_FOR_SEASONS
export const NEW_RELEASE = `#graphql
  query NewReleaseData(
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 24, sortKey: CREATED_AT) {
      nodes {
        availableForSale
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
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
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
    }
  }
` as const;

