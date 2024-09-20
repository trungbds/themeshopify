import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';


export async function loader(args: LoaderFunctionArgs) {
  const criticalData = await loadCriticalData(args);
  return defer({ ...criticalData})
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  if (!handle) {
    throw new Error('Expected collection handle to be defined');
  }

  const [{collection}] = await Promise.all([
    context.storefront.query(GET_PRODUCTS_BESTSELLER, {
      variables: {handle},
    }),
  ]);

  return {
    collection,
  };
}



const GET_PRODUCTS_BESTSELLER = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      products(first: 10,sortKey:BEST_SELLING) {
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



