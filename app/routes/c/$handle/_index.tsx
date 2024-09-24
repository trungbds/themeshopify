import {useState, Suspense, useEffect } from 'react'; 

import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await,useLoaderData, Link, type MetaFunction, useFetcher} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import type {ProductItemFragment, ProductQuickViewFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

import {COLLECTION_QUERY,COLOR_VARIANTS_COLLECTION_QUERY } from './server';
import { BoxSort, CategoryClass, FilterProductSideBar } from '~/components/custom-components';
import { ProductItemCustom } from '../all/_index/ProductItemCustom';
import { ProductModal } from '../all/_index/ProductModal';
import ProductsEmpty from '~/components/empty/ProductsEmpty';

// export const meta: MetaFunction<typeof loader> = ({data}) => {
//   return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
// };

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | All Products`}];
};


export async function loader(args: LoaderFunctionArgs) {
  const { context, params, request } = args;

  const paginationVariables = getPaginationVariables(request, { pageBy: 8 });
  const criticalData = await loadCriticalData({ context,params,request, paginationVariables });

  if (!criticalData.collection.products || !criticalData.collection.products.nodes) {
    return { products: { nodes: [], pageInfo: {} }, colorVariantsByProductId: {} };
  }

  const productIds = criticalData.collection.products.nodes.map((product: any) => product?.id).filter(Boolean);

  if (productIds.length === 0) {
    return { ...criticalData, colorVariantsByProductId: {} };
  }

  const deferredDataPromise = loadDeferredData({ context, productIds });

  return defer({
    ...criticalData,
    colorVariantsByProductId: deferredDataPromise,
    productIds,
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */

interface LoadCriticalDataArgs extends LoaderFunctionArgs {
  paginationVariables: any; 
}
async function loadCriticalData({
  context,
  params,
  request,
  paginationVariables,
}: LoadCriticalDataArgs) {
  const {handle} = params;
  const {storefront} = context;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Tạo mảng đối tượng JSON từ tham số 'productVendor' và 'productColor'
  const filtersParams = [
    ...searchParams.getAll('productVendor').map(vendor => ({ productVendor: vendor })),
    // ...searchParams.getAll('productColor').map(color => ({ productColor: color })),
  ];  
    // const filterParams: any[] = [];

  if (!handle) {
    throw redirect('/c');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle,filters : filtersParams, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
async function loadDeferredData({ context, productIds }: { context: any; productIds: string[] }) {
  const { storefront } = context;
  const { nodes } = await storefront.query(COLOR_VARIANTS_COLLECTION_QUERY, {
    variables: { ids: productIds },
  });

  const colorVariantsByProductId = (nodes || []).reduce((acc: any, node: any) => {
    if (node?.id && node.options?.[0]?.optionValues) {
      acc[node.id] = (node.options[0].optionValues || []).map((option: any) => ({
        swatch: {
          color: option.swatch?.color ?? null,
          image: {
            transformedSrc: option.swatch?.image?.previewImage?.transformedSrc ?? null
          }
        }
      }));
    }
    return acc;
  }, {});
  return  colorVariantsByProductId ;
}

export default function Collection() {


  const {collection, colorVariantsByProductId } = useLoaderData<typeof loader>();
  const {products} = collection;

  const [isModalOpen, setModalOpen] = useState(false); // Quản lý trạng thái modal
  const fetcher = useFetcher(); // Đặt fetcher ở đây
  const [selectedProduct, setSelectedProduct] = useState<ProductQuickViewFragment>() ;
  const handleAddToCart = (handle : string) => {
    fetcher.load(`/c/all/${handle}/quickview`);
  };

  // console.log('testFilter', testFilter)

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setSelectedProduct(fetcher.data as ProductQuickViewFragment);
      setModalOpen(true);
    }
  }, [fetcher.state, fetcher.data]);

  const closeModal = () => {
    setModalOpen(false); 
  };

  const fiilterColectionData = collection.products.filters; 

  console.log('products' ,products )


  if (!products.nodes || products.nodes.length === 0) {
    return <ProductsEmpty title ={collection.title} />
  }
  

  return (
    <>
      <section className='collection-page__header'>
        <div className="container">
          <div className="collection-header">
            <div className='collection-title'>
              <h1>{collection.title}</h1>
            </div>
            <CategoryClass />
          </div>
        </div>
      </section>

      <section className='collection-page__detail'>
        <div className="container">
          <div className="collection">
            
            {/* Filter Sidebar */}
            <FilterProductSideBar
              isActive={true}
              data = {fiilterColectionData}
            />
            
            <div className="collection-result">
              {/* sortby */}
              <BoxSort />

              {/* pagination */}
              <PaginatedResourceSection<ProductItemFragment>
                connection={products}
                resourcesClassName="products-grid"
              >
                {({node: product, index}) => (
                  <Suspense fallback={<div>Loading color variants...</div>}>
                    <Await 
                      errorElement="There was a problem loading product variants"
                      resolve={colorVariantsByProductId}
                    >
                      {(colorVariantsByProductId) => (
                        <ProductItemCustom
                          type ='default'
                          key={product.id}
                          loading={index < 8 ? 'eager' : undefined}
                          product={product}
                          colorVariants={colorVariantsByProductId[product.id] || []}
                          onAddToCart={() => handleAddToCart(product.handle)} // Truyền hàm mở modal cho ProductItem
                        />
                      )}
                    </Await>
                  </Suspense>
                )}
              </PaginatedResourceSection> 

            </div>
            {/* product modal  -- click "Add to cart()"*/}
            {isModalOpen && (
              <Suspense fallback={<div>Loading product...</div>}>
                <Await
                  resolve={fetcher.data}
                  errorElement="There was a problem loading product"  
                >
                  {(product) => (
                    <ProductModal
                      onClose={closeModal}
                      product={product}
                      loading={fetcher.state === 'loading'}
                    />
                  )}
                </Await>
              </Suspense>
            )}
            
            <Analytics.CollectionView
              data={{
                collection: {
                  id: collection.id,
                  handle: collection.handle,
                },
              }}
            />
          </div>
        </div>
      </section>
    </>
    
  );
}
