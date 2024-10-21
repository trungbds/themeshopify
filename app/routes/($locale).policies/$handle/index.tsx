import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, NavLink, useLoaderData, useLocation, type MetaFunction } from '@remix-run/react'; 
import { useEffect } from 'react'; 
import { type Shop } from '@shopify/hydrogen/storefront-api-types';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';

export const handle = {
  breadcrumbType: 'policy',
};

type SelectedPolicies = keyof Pick<Shop, 'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'>;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Bestspend | ${data?.policy.title ?? ''}` }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', { status: 404 });
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', { status: 404 });
  }

  return {
    data,
    policy
  };
}

export default function Policy() {
  const { data, policy } = useLoaderData<typeof loader>();
  const { policies } = data;
  const location = useLocation();

  const policiesList = Object.entries(policies).filter(
    ([key, value]) => value && key !== 'subscriptionPolicy'
  );

  useEffect(() => {
    const toc = document.getElementById('toc');
    const headings = document.querySelectorAll('.page-content h2, .page-content h3');

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
  }, [policy, location.pathname]); // Cập nhật lại khi policy hoặc đường dẫn thay đổi

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
    <>
      <section>
        <div className="container">
          <div className='page-main'>
            

            <div className="policy page-content">
              <h1 className='title'>{policy.title}</h1>
              <div className='toc-container'>
                <ul id="toc"></ul>
              </div>

              <div dangerouslySetInnerHTML={{ __html: policy.body }} />
            </div>
            <div className='page-sidebar'>
              <h2 className='title'><Link to="/policies">Our policies</Link></h2>
              <div className='policies-list'>
                {policiesList.map(([policyKey, shopPolicy]) => {
                  if (!shopPolicy) return null;

                  return (
                    <NavLink 
                      key={shopPolicy.id} 
                      to={`/policies/${shopPolicy.handle}`}
                      className={({ isActive, isPending }) =>
                        `nav-item ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`
                      }
                    >
                      <span>{shopPolicy.title}</span>
                      <img src={iconchevronright} />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql

fragment Policy on ShopPolicy {
  body
  handle
  id
  title
  url
}

fragment PolicyItem on ShopPolicy {
  id
  title
  handle
}

query Policy(
  $country: CountryCode
  $language: LanguageCode
  $privacyPolicy: Boolean!
  $refundPolicy: Boolean!
  $shippingPolicy: Boolean!
  $termsOfService: Boolean!
) @inContext(language: $language, country: $country) {
  shop: shop {
    privacyPolicy @include(if: $privacyPolicy) {
      ...Policy
    }
    shippingPolicy @include(if: $shippingPolicy) {
      ...Policy
    }
    termsOfService @include(if: $termsOfService) {
      ...Policy
    }
    refundPolicy @include(if: $refundPolicy) {
      ...Policy
    }
  }

  policies: shop {
    privacyPolicy {
      ...PolicyItem
    }
    shippingPolicy {
      ...PolicyItem
    }
    termsOfService {
      ...PolicyItem
    }
    refundPolicy {
      ...PolicyItem
    }
    subscriptionPolicy {
      id
      title
      handle
    }
  }
}` as const;
