import {Await, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  RecommendedProductsQuery
} from 'storefrontapi.generated';


export default function RecommendedProducts({
    products,
  }: {
    products: Promise<RecommendedProductsQuery | null>;
  }) {
    return (
      <div className="recommended-products">
        <h2>Recommended Products Homepage</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {(response) => (
              <div className="recommended-products-grid">
                {response
                  ? response.products.nodes.map((product) => (
                      <Link
                        key={product.id}
                        className="recommended-product"
                        to={`/p/${product.handle}`}
                      >
                        <Image
                          data={product.images.nodes[0]}
                          aspectRatio="1/1"
                          sizes="(min-width: 45em) 20vw, 50vw"
                        />
                        <h4>{product.title}</h4>
                        <small>
                          <Money data={product.priceRange.minVariantPrice} />
                        </small>
                      </Link>
                    ))
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
        <br />
      </div>
    );
  }