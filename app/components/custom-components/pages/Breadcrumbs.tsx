import { Link, useMatches } from '@remix-run/react';
import { z } from 'zod';
import iconhome from '~/assets/fonts/icons/icon-home.svg';


type TemplateType = 'default' | 'product' | 'homepage';
type BreadcrumbsProps = {
  isActive: boolean;
};

// Define the structure for the route data
interface CollectionData {
  handle: string;
  title: string;
}

interface ProductData {
  handle: string;
  collections: {
    nodes: CollectionData[];
  };
}

interface RouteHandle {
  breadcrumbType?: 'collections' | 'collection' | 'product';
}

interface DeepestRoute {
  handle?: RouteHandle;
  data?: {
    collection?: CollectionData; // Define the shape of your data
    product?: ProductData; // Define the shape of your product data
  };
}

export const breadcrumbTypeSchema = z.enum([
  'collections', 
  'collection',
  'product'
]);
export type TBreadcrumbType = z.infer<typeof breadcrumbTypeSchema>;

export function Breadcrumbs({ isActive }: BreadcrumbsProps) {
  const matches = useMatches();
  const deepestRoute = matches.at(-1) as DeepestRoute; // Cast to DeepestRoute

  const parseBreadcrumbType = breadcrumbTypeSchema.safeParse(
    deepestRoute?.handle?.breadcrumbType // TypeScript will understand that breadcrumbType exists
  );

  const isValidBreadcrumbType = parseBreadcrumbType.success;

  const pages: { href: string; name: string }[] = [{ href: '/', name: 'Home' }];

  if (isValidBreadcrumbType) {
    switch (parseBreadcrumbType.data) {
      case 'collections':
        pages.push({
          href: '/c',
          name: 'Collections',
        });
        break;

      case 'collection':
        pages.push({
          href: '/c',
          name: 'Collections',
        });

        const collection = deepestRoute.data?.collection;
        if (collection) {
          pages.push({
            href: `/c/${collection.handle}`,
            name: collection.title,
          });
        }

        break;

      case 'product':
        pages.push({
          href: '/c',
          name: 'Collections',
        });

        const product = deepestRoute.data?.product;
        if (product) {
          const firstCollection = product.collections.nodes.at(0);
          console.log('firstCollection', deepestRoute.data)
          if (firstCollection) {
            pages.push({
              href: `/c/${firstCollection.handle}`,
              name: firstCollection.title,
            });
          }

          pages.push({
            href: `/c/${product.handle}`,
            name: product.title,
          });
        }
        break;

      default:
        break;
    }

    return <BreadcrumbsComponent pages={pages} />;
  } else {
    return null;
  }
}

type Pages = {
  href: string;
  name: string;
};

function BreadcrumbsComponent({ pages }: { pages: Pages[] }) {
  const lashMark = (
    <svg
      className="shrink-0 size-5 text-gray-400 dark:text-neutral-600"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6 13L10 3" stroke="currentColor" strokeLinecap="round"></path>
    </svg>
  );

  return (
    <section className="breadcrumbs-section">
      <div className="container">
        <div className="breadcrumbs">
          <ol className="flex items-center whitespace-nowrap breadcrumbs-list">
            {pages.map((page, index) => (
              <li key={index} className="inline-flex items-center">
                {page.name === 'Home' ? (
                  <>
                    <Link
                      className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
                      to={page.href}
                      prefetch="intent"
                    >
                      <img src={iconhome} alt="Home Icon" className="" />
                    </Link>
                    {index < pages.length - 1 && lashMark}
                  </>
                ) : index < pages.length - 1 ? (
                  <>
                    <Link
                      className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                      to={page.href}
                      prefetch="intent"
                    >
                      {page.name}
                    </Link>
                    {lashMark}
                  </>
                ) : (
                  <span className="inline-flex items-center text-sm font-semibold text-gray-800 truncate dark:text-neutral-200">
                    {page.name}
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div className="helpers-product">
            <span>For Help? </span>
            <a href="#">Get in Touch</a>
          </div>
        </div>
      </div>
    </section>
  );
}
