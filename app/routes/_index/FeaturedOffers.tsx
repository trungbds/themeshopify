import { Link } from "@remix-run/react";
import { Image } from "@shopify/hydrogen";

// Swiper
import { Navigation,  Pagination as PaginationSwiper  } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';


export default function FeaturedOffers(
    {collections} : {collections ?: any}
){
    console.log(collections) // For debugging purposes
    return (
        <section className="featured-offers">
            <div className="container">
                <h2 className="col-span-4 title-selection">Our Featured Offers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-full">

                    {collections.map((collection:any) => (
                        <div className="col-span-1 sm:col-span-1 md:col-span-1 ">
                            <Link 
                                key={collection.id}
                                className="featured-offers__item link-primary"
                                to={`/c/${collection.handle}`}
                                prefetch="intent"
                            >
                                <Image
                                    alt={collection.image?.altText || "No description"}
                                    data={collection.image}
                                    loading="lazy"
                                    className=""
                                    aspectRatio="400/320"
                                />
                                <h3 className="link-hover">{collection.title}</h3>
                                <p>{collection.description}</p>
                            </Link>

                        </div>
                        
                    ))}

                </div>
            </div>
                
        </section>
    )
}