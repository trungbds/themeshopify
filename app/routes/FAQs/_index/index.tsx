import { json, type LoaderFunctionArgs, defer } from '@shopify/remix-oxygen';
import { useLoaderData, Link, type MetaFunction, Await } from '@remix-run/react';
import { Suspense } from 'react';
import categories from '../categories.json';

import iconpackage from '~/assets/fonts/icons/icon-package.svg';
import helpcontact from '~/assets/images/help-contact.png';
import FaqsCategoryItem from '~/components/custom-components/skeleton/FaqsCategoryItem';

// Meta data
export const meta: MetaFunction = () => {
  return [{ title: `Bestspend | FAQs` }];
};

// Handle breadcrumb
export const handle = {
  breadcrumbType: 'faqs',
};

// Interface for category structure
interface FAQItem {
  id: number;
  documentId: string;
  question: string;
  shortAnswer: string | null;
  fullAnswer: string | null;
  faq_category: {
    id: number;
    documentId: string;
    category: string;
    slug: string;
  };
}

interface Category {
  id: number;
  documentId: string;
  category: string;
  slug: string;
  results?: {
    data: FAQItem[];
  };
}

// Loader function
export async function loader({ params }: LoaderFunctionArgs) {
  const baseFaqsPath = '../$handle/';
  const categoriesData = categories.data;

  const enhancedCategoriesPromise = Promise.all(
    categoriesData.map(async (category) => {
      const faqFilePath = `${baseFaqsPath}/${category.id}.faqs.json`;

      try {
        const faqs = await import(faqFilePath);
        return { ...category, results: faqs.default };
      } catch (error) {
        console.error(`Cannot fetch file category-id: ${category.id}`, error);
        return { ...category, results: { data: [] } };
      }
    })
  );

  return defer({
    enhancedCategoriesPromise,
  });
}

// FAQs component
export default function FAQs() {
  const { enhancedCategoriesPromise } = useLoaderData<typeof loader>();

  return (
    <section>
      <div className="container">
        <h1 className="page-title">FAQs</h1>

        {/* Suspense to show loading until data is ready */}
        <Suspense 
          fallback={
            <FaqsCategoryItem />
          }
          
        >
          <Await resolve={enhancedCategoriesPromise}>
            {(enhancedCategories) => (
              <div className="faqs">
                {enhancedCategories.map((category) => (
                  <div key={category.id} className="faqs__category">
                    <h3 className="title">{category.category}</h3>
                    {category.results?.data.length ? (
                      category.results.data.map((item: FAQItem) => (
                        <Link
                          key={item.id}
                          to={`/faqs/${category.slug}#${item.id}`}
                          className="faqs__item"
                        >
                          <h4 className="question">{item.question}</h4>
                        </Link>
                      ))
                    ) : (
                      <p className='note'>No FAQs available</p>
                    )}

                    <Link
                      to={`/faqs/${category.slug}`}
                      className="btn link-secondary"
                    >
                      <span className="link-hover">See all...</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Await>
        </Suspense>

        <div className="help-contact">
          <div className="help-contact__detail">
            <div className="help-contact__title">
              <h3>We're here to help you!</h3>
              <p className='help-contact__text'>Faster, better support</p>
            </div>
            
            <Link to='/' className='btn help-contact__link'>Contact Us</Link>
            <Link to='/' className='btn help-contact__link'>Live chat</Link>
            <img src={helpcontact} alt="" className='bg-img'/>
          </div>
        </div>
      </div>
    </section>
  );
}
