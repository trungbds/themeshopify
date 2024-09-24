
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await,useFetcher, useLoaderData, type MetaFunction} from '@remix-run/react';
import {useState, Suspense, useEffect } from 'react'; 
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItemCustom} from './ProductItemCustom';
import {ProductModal} from './ProductModal'; 
import {CategoryClass , BoxSort, FilterProductSideBar} from '~/components/custom-components';
import type {ProductItemFragment, ProductQuickViewFragment} from 'storefrontapi.generated';


// Query 
import { CATALOG_QUERY, COLOR_VARIANTS_QUERY } from './get-products.server'; 


export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | All Products`}];
};

// Hàm load dữ liệu quan trọng (Critical Data)
async function loadCriticalData({ context, paginationVariables }: { context: any; paginationVariables: any }) {
  const { storefront } = context;

  // Thực hiện truy vấn CATALOG_QUERY
  const { products } = await storefront.query(CATALOG_QUERY, {
    variables: { ...paginationVariables },
  });

  return { products };
}

// Hàm load dữ liệu deferred (Color Variants)
async function loadDeferredData({ context, productIds }: { context: any; productIds: string[] }) {
  const { storefront } = context;

  // Truy vấn để lấy các biến thể màu sắc dựa trên productIds
  const { nodes } = await storefront.query(COLOR_VARIANTS_QUERY, {
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

// Loader tích hợp
export async function loader(args: LoaderFunctionArgs) {
  const { context, request } = args;

  const paginationVariables = getPaginationVariables(request, { pageBy: 8 });
  const criticalData = await loadCriticalData({ context, paginationVariables });

  if (!criticalData.products || !criticalData.products.nodes) {
    return { products: { nodes: [], pageInfo: {} }, colorVariantsByProductId: {} };
  }

  const productIds = criticalData.products.nodes.map((product: any) => product?.id).filter(Boolean);

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

export default function Collection() {
  const {products, colorVariantsByProductId } = useLoaderData<typeof loader>();

  const [isModalOpen, setModalOpen] = useState(false); // Quản lý trạng thái modal
  const fetcher = useFetcher(); // Đặt fetcher ở đây
  const [selectedProduct, setSelectedProduct] = useState<ProductQuickViewFragment>() ;
  const handleAddToCart = (handle : string) => {
    fetcher.load(`/c/all/${handle}/quickview`);
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setSelectedProduct(fetcher.data as ProductQuickViewFragment);
      setModalOpen(true);
    }
  }, [fetcher.state, fetcher.data]);

  const closeModal = () => {
    setModalOpen(false); 
  };

  return (
    <>
      <section>
        <section className='collection-page__header'>
          <div className="container">
            <div className="collection-header">
              <div className='collection-title'>
                <h1>All Products</h1>
              </div>
              <CategoryClass />
            </div>
          </div>
        </section>
        <section className='collection-page__detail'>
          <div className="container">
            <div className="collection">

              {/* Filter Sidebar */}
              <FilterProductSideBar />

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
            </div>
          </div>

        </section>


        
      </section>
    </>

  );
}
