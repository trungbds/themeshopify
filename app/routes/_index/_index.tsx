import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import type {
  FeaturedCollectionFragment,
} from 'storefrontapi.generated';

import RecommendedProducts from '~/components/custom-components/RecommendedProducts';

import {
  FEATURED_COLLECTION_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  HOMEPAGE_COLLECTIONS_RENDER,
  HOMEPAGE_BESTSELLER_LIST,
  TODAY_INTERSTING_ITEM, 
  IDEAL_FOR_SEASONS,
  NEW_RELEASE} from './server';
import HeroHomepage from './HeroHomepage';
import BestSellerSelection from './BestSellerSelection';
import FeaturedOffers from './FeaturedOffers';
import TodayInterestingItem from './TodayInterestingItem';
import AllCategories from './AllCategories';
import IdealForSeasons from './IdealForSeasons';
import NewRelease from './NewRelease';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{ collections: featuredCollections }, HomepageCollections, {menu}, TodayInteresting,IdealSeasons,NewReleaseData] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HOMEPAGE_COLLECTIONS_RENDER),
    context.storefront.query(HOMEPAGE_BESTSELLER_LIST),
    context.storefront.query(TODAY_INTERSTING_ITEM),
    context.storefront.query(IDEAL_FOR_SEASONS), 
    context.storefront.query(NEW_RELEASE),
  ]);

  return {
    featuredCollection: featuredCollections.nodes[0],
    HomepageCollections: HomepageCollections,
    menu,
    TodayInteresting,
    IdealSeasons,
    NewReleaseData

  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/c/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}


function groupCollectionsByTypeWithNulls(data: { [key: string]: any }) {
  const grouped: { [key: string]: any[] } = {};
  for (const [key, value] of Object.entries(data)) {
    // Tách loại (type) của collection từ tên khóa
    const type = key.replace(/[0-9]+$/, ''); // Loại bỏ số cuối cùng để lấy tên nhóm (ví dụ: 'hero', 'ourfeaturedoffers')
    // Nếu nhóm chưa tồn tại, khởi tạo nó
    if (!grouped[type]) {
      grouped[type] = [];
    }
    // Thêm giá trị vào nhóm tương ứng
    grouped[type].push(value);
  }
  return grouped;
}



export default function Homepage() {

  const data = useLoaderData<typeof loader>();
  const {HomepageCollections , menu, TodayInteresting, IdealSeasons, NewReleaseData} = useLoaderData<typeof loader>();
  
  const homepageDataCollections =  groupCollectionsByTypeWithNulls(HomepageCollections);

  const heroData = {
    hero : homepageDataCollections.hero,
    heroList: homepageDataCollections.heroList,
  };

  // Không còn dùng nữa  
  // const bestsellerData = homepageDataCollections.bestseller; 

  const ourfeaturedoffersData = homepageDataCollections.ourfeaturedoffers;

  // Bestseller 
  // const getProductsBestSeller = (id : string) => {
  //   fetcher.load(`/${id}/bestseller`);
  // };

  return (
    <div className="homepage">
      <HeroHomepage 
        collections = {heroData}
      />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <FeaturedOffers 
        collections = {ourfeaturedoffersData}
      />

      <BestSellerSelection 
        collectionsList = {menu}
        // getProductsBestSeller = {getProductsBestSeller}
      />
      
      <TodayInterestingItem 
        collections = {TodayInteresting}
      />

      <AllCategories 
        collectionsList = {menu}
      />

      <IdealForSeasons 
        collections={ IdealSeasons}
      />
      
      <NewRelease 
        products={NewReleaseData}
      />
      


      
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}

      
    </div>
  );
}

