import { Link, useMatches } from '@remix-run/react';
import { z } from 'zod';
import iconhome from '~/assets/fonts/icons/icon-home.svg';


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

interface BlogsData {
  handle: string;
  title: string;
}

interface BlogData {
  handle: string;
  title: string;
}

interface ArticleBlogData {
  title: string;
  handle: string;
  blog: BlogData;
}

interface FaqData {
  
}





interface RouteHandle {
  breadcrumbType?: 'collections' | 'collection' | 'product' | 'policies' | 'policy' | 'blogs' | 'blog' | 'article' | 'helpcenter' | 'faqs' | 'faq' | 'account' ;
}

interface DeepestRoute {
  handle?: RouteHandle;
  data?: {
    collection?: CollectionData; 
    product?: ProductData;
    blogs?: BlogsData;
    blog? : BlogData;
    article? : ArticleBlogData;
    matchedCategory? : any
  };
}

export const breadcrumbTypeSchema = z.enum([
  'collections', 
  'collection',
  'product',
  'policies',
  'policy',
  'blogs',
  'blog',
  'article',
  'helpcenter',
  'faqs',
  'faq',
  'account'
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
        
      case 'policies':
        pages.push({
          href: '/policies',
          name: 'Policies',
        });
      break;
        
      case 'policy':
        pages.push({
          href: '/policies',
          name: 'Policies',
        });

        const policy = deepestRoute.data?.policy;
        if (policy) {
          pages.push({
            href: `/policies/${policy.handle}`,
            name: policy.title,
          });
        }

      break;

      case 'blogs':
        pages.push({
          href: '/blogs',
          name: 'Blogs',
        });
      break;

      case 'blog':
        pages.push({
          href: '/blogs',
          name: 'Blogs',
        });

        const blog = deepestRoute.data?.blog;
        if (blog) {
          pages.push({
            href: `/c/${blog.handle}`,
            name: blog.title,
          });
        }
      break;

      case 'article':
        pages.push({
          href: '/blogs',
          name: 'Blogs',
        });

        const article = deepestRoute.data?.article;
        if (article) {
          const firstBlog = article.blog;
          if (firstBlog) {
            pages.push({
              href: `/blogs/${firstBlog.handle}`,
              name: firstBlog.title,
            });
          }

          pages.push({
            href: `/blogs/${article.handle}`,
            name: article.title,
          });
        }
      break;

      case 'helpcenter':
        pages.push({
          href: '/c',
          name: 'Help center',
        });
      break;
      
  
      case 'faqs':
        pages.push({
          href: '/faqs',
          name: 'FAQs',
        });
      break;

      case 'faq':
        pages.push({
          href: '/faqs',
          name: 'FAQs',
        });

        const faq = deepestRoute.data?.matchedCategory;
        if (faq) {
          pages.push({
            href: `/faqs/${faq.slug}`,
            name: faq.category,
          });
        }
      break;
      

      case 'account':
        pages.push({
          href: '/account',
          name: 'Account',
        });

        const account = deepestRoute.data?.matchedCategory;
        if (account) {
          pages.push({
            href: `/account/${account.slug}`,
            name: account.category,
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
                      className="link-primary flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                      to={page.href}
                      prefetch="intent"
                    >
                      <span className='link-hover'>{page.name}</span>
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
