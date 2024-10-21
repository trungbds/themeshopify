import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useLocation, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import { useEffect } from 'react';
import SharePost from '~/components/custom-components/helpers/SharePost';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.article.title ?? ''} article`}];
};

export const handle = {
  breadcrumbType :'article'
}


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
async function loadCriticalData({context, params}: LoaderFunctionArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return {article};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  const location = useLocation();

  
  useEffect(() => {
    const toc = document.getElementById('toc');
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');

    if (toc) {
      toc.innerHTML = ''; // Xóa nội dung cũ của danh mục
      let h2Counter = 0; // Đếm cho h2
      let h3Counter = 0; // Đếm cho h3

      headings.forEach((heading) => {
        if (heading.tagName === 'H2') {
          h2Counter++;
          h3Counter = 0; // Đặt lại h3Counter khi có h2 mới

          // Chỉ cập nhật tiêu đề h2 nếu chưa có số thứ tự
          if (!heading.innerHTML.match(/^\d+\/\s/)) {
            heading.innerHTML = `${h2Counter}/ ${heading.innerHTML}`;
          }

          const listItem = document.createElement('li');
          const link = document.createElement('a');
          const id = `heading-${h2Counter}`;

          heading.setAttribute('id', id);
          link.setAttribute('href', `#${id}`);
          link.textContent = `${heading.textContent || `Section ${h2Counter}`}`;
          listItem.appendChild(link);
          toc.appendChild(listItem);

          link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToHeading(id);
          });
        } else if (heading.tagName === 'H3') {
          h3Counter++;

          // Chỉ cập nhật tiêu đề h3 nếu chưa có số thứ tự
          if (!heading.innerHTML.match(/^\d+\.\d+\/\s/)) {
            heading.innerHTML = `${h2Counter}.${h3Counter}/ ${heading.innerHTML}`;
          }

          const listItem = document.createElement('li');
          const link = document.createElement('a');
          const id = `heading-${h2Counter}.${h3Counter}`;

          heading.setAttribute('id', id);
          link.setAttribute('href', `#${id}`);
          link.textContent = `${heading.textContent || `Child Section ${h3Counter}`}`;
          listItem.style.paddingLeft = '16px'; // Lùi vào cho h3
          listItem.appendChild(link);
          toc.appendChild(listItem);

          link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToHeading(id);
          });
        }
      });
    }
  }, [ location.pathname]); // Cập nhật lại khi policy hoặc đường dẫn thay đổi

  const scrollToHeading = (id) => {
    const targetHeading = document.getElementById(id);
    const headerOffset = 86; // Khoảng cách từ đỉnh
    const elementPosition = targetHeading.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };


  return (
    <section >
      <div className="container">
        <div className='article'>


          <div className='article-sidebar__left'>
            <div className='toc-container'>
              <h4 className='title'>Table of Contents</h4>
              <ul id="toc" />
            </div>
          </div>


          <div className="article-detail">
            <div className="article-header">
              <h1>{title}</h1>
              <span>{publishedDate}</span>
              <span>{author?.name}</span>
            </div>
            
            {image && <Image className="featured-img" data={image} sizes="90vw" loading="eager" />}

            <div
              dangerouslySetInnerHTML={{__html: contentHtml}}
              className="article-content"
            />



            <SharePost title={title} />

          </div>


        




        </div>
        

      </div>
    </section>
    
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
        blog {
          handle
          title
        }
      }
    }
  }
` as const;
