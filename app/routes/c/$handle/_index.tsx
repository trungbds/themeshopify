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

import {COLLECTION_QUERY,COLOR_VARIANTS_COLLECTION_QUERY, MENU_COLLECTION } from './server';
import { BoxSort, CategoryClass, FilterProductSideBar } from '~/components/custom-components';
import { ProductItemCustom } from '../all/_index/ProductItemCustom';
import { ProductModal } from '../all/_index/ProductModal';
import ProductsEmpty from '~/components/empty/ProductsEmpty';
import SearchProductsEmpty from '~/components/empty/SearchProductsEmpty';
import GridList from '~/components/custom-components/helpers/GridList';
import { IconDefaultListView } from '~/components/custom-components/icons/default/IconDefaultListView';
import { IconDefaultGridView } from '~/components/custom-components/icons/default/IconDefaultGridView';


interface FilterParam {
  productVendor?: string;
  variantOption?: {
    name: string;
    value: string;
  };
  price?: {
    min: number;
    max: number;
  };
}

interface SortByParam {
  sortKey?: string;
  reverse? : boolean;
}


// export const meta: MetaFunction<typeof loader> = ({data}) => {
//   return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
// };

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | All Products`}];
};

export const handle = {
  breadcrumbType :'collection'
}


export async function loader(args: LoaderFunctionArgs) {
  const { context, params, request } = args;

  const paginationVariables = getPaginationVariables(request, { pageBy: 48 });
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
  const { handle } = params;
  const { storefront } = context;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Tạo mảng đối tượng JSON từ tham số 'productVendor'
  const filtersParams: FilterParam[] = [];

  // Xử lý productVendor: Tách các giá trị thành mảng
  const productVendors = searchParams.get('productVendor');
  if (productVendors) {
    const vendorList = productVendors.split(','); // Tách các giá trị bằng dấu phẩy
    vendorList.forEach(vendor => {
      filtersParams.push({ productVendor: vendor });
    });
  }

  // Xử lý variantOption: Lấy từ URL và chuyển thành mảng đối tượng JSON
  const variantOptionsParam = searchParams.get('variantOption');
  if (variantOptionsParam) {
    try {
      // Giải mã và phân tích JSON từ URL
      const variantOptions = JSON.parse(decodeURIComponent(variantOptionsParam)) as { [key: string]: any }[];

      // Thêm variantOption vào filtersParams
      variantOptions.forEach(option => {
        Object.entries(option).forEach(([name, value]) => {
          filtersParams.push({ variantOption: { name, value } });
        });
      });
    } catch (error) {
      console.error('Error parsing variantOption from URL:', error);
    }
  }

  // Xử lý giá trị price nếu có
  const priceParam = searchParams.get('price');
  if (priceParam) {
    try {
      const price = JSON.parse(decodeURIComponent(priceParam)) as { min: number; max: number };
      filtersParams.push({ price });
    } catch (error) {
      console.error('Error parsing price from URL:', error);
    }
  }

  // Xử lý sortby nếu có
  const sortKeyParam: String | null = searchParams.get('sortKey');
  const reverseParam: String | null = searchParams.get('reverse');

  // Gán giá trị cho sortKey hoặc null nếu không có
  const sortKey: String | null = sortKeyParam ? sortKeyParam : null;

  // Chuyển đổi reverseParam thành boolean hoặc null nếu không có
  const reverse: Boolean | null = reverseParam === 'true' ? true : reverseParam === 'false' ? false : null;

  // Kiểm tra handle trước khi thực hiện truy vấn
  if (!handle) {
    throw redirect('/c');
  }

  // Thực hiện các truy vấn song song
  const [{ collection }, MenuCollection] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        filters: filtersParams,
        ...paginationVariables,
        sortKey, // Gửi sortKey như là null hoặc giá trị
        reverse: reverse !== null ? reverse : null, // Gửi reverse như là null nếu không có giá trị
      },
    }),
    storefront.query(MENU_COLLECTION),
  ]);


  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
    filtersParams,
    MenuCollection
  };
}
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
  const {collection, colorVariantsByProductId, filtersParams , MenuCollection} = useLoaderData<typeof loader>();
  const {products} = collection;

  const [isModalOpen, setModalOpen] = useState(false); // Quản lý trạng thái modal
  const fetcher = useFetcher(); // Đặt fetcher ở đây
  const [selectedProduct, setSelectedProduct] = useState<ProductQuickViewFragment>() ;
  const handleAddToCart = (handle : string) => {
    fetcher.load(`/c/all/${handle}/quickview`);
  };

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      setSelectedProduct(fetcher.data as ProductQuickViewFragment);
      setModalOpen(true);
    }
  }, [fetcher.state, fetcher.data]);

  const closeModal = () => {
    setModalOpen(false); 
  };

  //fiilterColectionData
  const fiilterColectionData :any[] =collection.products.filters ; 

  if (!products.nodes || products.nodes.length === 0 && fiilterColectionData.length === 0) {
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

            <CategoryClass 
              menuCollection={MenuCollection.menu.items}
              collectionId={collection.id}
            />
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
              filtersParams = {filtersParams}
              collectionId={collection.id} 
            />
            
            <div className="collection-result">
              {/* sortby */}
              <div className="collection-result__header">
                <div className="grid-list inline-flex">
                  <button
                      type="button"
                      className={`btn list-view ${viewType === 'list' ? 'selected' : ''}`} 
                      onClick={() => setViewType('list')} 
                  >
                      <IconDefaultListView
                          width='20'
                          height='20'
                          color={`${viewType === 'list' ? '#000' : '#ddd'}`} 
                      />
                      <span>List</span>
                  </button>

                  <button
                      type="button"
                      className={`btn grid-view ${viewType === 'grid' ? 'selected' : ''}`} 
                      onClick={() => setViewType('grid')} 
                  >
                      <IconDefaultGridView 
                          width='20'
                          height='20'
                          color={`${viewType === 'grid' ? '#000' : '#ddd'}`} 
                      />
                      <span>Grid</span>
                  </button>
                </div>
    
                <BoxSort />
              </div>

              {/* pagination */}
              {products.nodes.length === 0 ? ( 
                <SearchProductsEmpty /> // Thông báo nếu danh sách trống
              ) : (
                <PaginatedResourceSection<ProductItemFragment>
                  connection={products}
                  resourcesClassName={`products-grid ${viewType === 'grid' ? 'grid-view' : 'list-view'}`}
                >
                  {({node: product, index}) => (
                    <Suspense fallback={<div>Loading color variants...</div>}>
                      <Await
                        errorElement="There was a problem loading product variants"
                        resolve={colorVariantsByProductId}
                      > 
                        {(colorVariantsByProductId) => (
                          <ProductItemCustom
                            type='default'
                            key={product.id}
                            loading={index < 8 ? 'eager' : undefined}
                            product={product}
                            colorVariants={colorVariantsByProductId[product.id] || []}
                            onAddToCart={() => handleAddToCart(product.handle)} 
                          />
                        )}
                      </Await>
                    </Suspense>
                  )}
                </PaginatedResourceSection>
              )}


            </div>
            {/* product modal  -- click "Add to cart()"*/}
            {isModalOpen && (
              <Suspense fallback={
                <div className="modal product-modal loading">
                  <div className="modal-overlay" />
                  <div>Loading product item...</div>
                </div>
              }>
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
