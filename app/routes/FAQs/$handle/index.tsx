import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, Link, NavLink, useParams, type MetaFunction } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import categories from '../categories.json';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import helpcontact from '~/assets/images/help-contact.png';
import icondropdown from '~/assets/fonts/icons/icon-dropdown.svg';

interface Category {
  id: number;
  documentId: string;
  category: string;
  slug: string;
}

interface FaqItem {
  id: number;
  question: string;
  shortAnswer: string;
}

export const handle = {
  breadcrumbType: 'faq',
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: `FAQs | Bestspend ` }];
  }
  return [{ title: `FAQs ${data.matchedCategory.category} | Bestspend ` }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const currentHandle = params.handle;
  const matchedCategory = categories.data.find(
    (category: Category) => category.slug === currentHandle
  );

  if (!matchedCategory) {
    throw new Response('Not found', { status: 404 });
  }
  return json({ matchedCategory });
}



export default function FAQ() {
  const { matchedCategory } = useLoaderData<{ matchedCategory: Category }>();
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<{ [key: number]: number }>({});

  const loadFaqData = async (categoryId: number) => {
    setLoading(true);
    try {
      const faq = await import(`./${categoryId}.faqs.json`);

      if (faq.default && Array.isArray(faq.default.data)) {
        setFaqData(faq.default.data);
      } else {
        console.error('FAQ data is not in expected format:', faq.default);
        setFaqData([]);
      }
    } catch (error) {
      console.error('Failed to load FAQs JSON:', error);
      setFaqData([]);
    }
    setLoading(false);
  };

  // Lấy giá trị từ URL hash và mở câu hỏi tương ứng
  useEffect(() => {
    if (matchedCategory) {
      loadFaqData(matchedCategory.id); // Tải dữ liệu câu hỏi dựa trên ID category
    }
  }, [matchedCategory]);

  useEffect(() => {
    const hashId = window.location.hash.replace('#', '');
    if (hashId) {
      const indexToOpen = faqData.findIndex(faq => faq.id === parseInt(hashId));
      if (indexToOpen !== -1) {
        setOpenIndex(indexToOpen);
      }
    }
  }, [faqData]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    if (openIndex !== index) {
      window.history.replaceState(null, '', `#${faqData[index].id}`);
    } else {
      window.history.replaceState(null, '', `${window.location.pathname}`);
    }
  };

  const shortAnswerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (openIndex !== null && shortAnswerRefs.current[openIndex]) {
      const currentHeight = shortAnswerRefs.current[openIndex]?.scrollHeight || 0;
      setHeights((prev) => ({ ...prev, [openIndex]: currentHeight }));
    }
  }, [openIndex]);

  return (
    <>
      <section>
        <div className="container">
          <div className="page-main page-faq">
            <div className="page-content">

              <div className="page-content__header">
                <span className='sub-title'>FAQs for</span>
                <h1 className="title">{matchedCategory ? `${matchedCategory.category}` : 'FAQs'}</h1>
              </div>
              
              <div className="page-content__detail">
                {loading ? (
                  <p>Loading...</p>
                ) : faqData.length > 0 ? (
                  <>
                    {faqData.map((faq, index) => (
                      <div 
                        key={faq.id} 
                        className={openIndex === index ? 'faq-article actived' : 'faq-article'} 
                      >
                        <h4 className='btn link-primary question' onClick={() => toggleAccordion(index)}>
                          <span className='link-hover'>{faq.question}</span>
                          <img src={icondropdown} alt="icon dropdown" />
                        </h4>
                        
                        <div
                          className={`short-answer__cover ${openIndex === index ? 'open' : ''}`}
                          style={{
                            height: openIndex === index ? `${heights[openIndex]}px` : '0px',
                            overflow: 'hidden',
                            transition: 'height 0.3s ease'
                          }}
                        >
                          <div
                            className='short-answer'
                            ref={el => (shortAnswerRefs.current[index] = el)}
                            dangerouslySetInnerHTML={{ __html: faq.shortAnswer }} 
                          />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No FAQs available.</p>
                )}
              </div>
            </div>

            <div className="page-sidebar">
              <h2 className="title">
                <Link to="/faqs">Topic</Link>
              </h2>
              <div className="policies-list">
                {categories.data.map((category: Category) => (
                  <NavLink
                    key={category.id}
                    to={`/faqs/${category.slug}`}
                    className={({ isActive, isPending }) =>
                      `nav-item ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`
                    }
                  >
                    <span>{category.category}</span>
                    <img src={iconchevronright} alt="icon" />
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          

          <div className="help-contact">
            <div className="help-contact__detail">
              <div className="help-contact__title">
                <h3>We're here to help you !</h3>
                <p className='help-contact__text'>Faster, better support</p>
              </div>
              
              <Link to='/' className='btn help-contact__link'>Contact Us</Link>
              <Link to='/' className='btn help-contact__link'>Live chat </Link>
              <img src={helpcontact} alt="" className='bg-img'/>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}
