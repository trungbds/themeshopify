import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import noImage from '~/assets/images/no-image-available.png';

export default function AllCategories({ collectionsList }: { collectionsList: any }) {
    const { items } = collectionsList;

    console.log(items, 'items')

    return (
        <section className="all-categories">
            <div className="container">
                <div className="flex flex-wrap -mb-px items-baseline all-categories-list">
                    <h2 className="title-selection"> All categories</h2>

                    <div className='all-categories__list'>
                        {items.map((item: any, index: number) => (
                            <Link 
                                to='/'
                                className={`all-categories__item link-primary`}
                                aria-current={index ? "page" : undefined}
                            >
                                <Image
                                    data={item.resource?.image}
                                    sizes="(min-width: 45em) 50vw, 100vw"
                                    aspectRatio="2/3"
                                />
                                <h4 className='link-hover'>{item.title}</h4> 
                                
                            </Link>
                        ))}

                    </div>
                </div>
            </div>
            
        </section>
    );
}
