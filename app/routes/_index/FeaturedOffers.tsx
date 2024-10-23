import { Link } from "@remix-run/react";
import { Image } from "@shopify/hydrogen";
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';


export default function FeaturedOffers(
    {collections} : {collections ?: any}
){
    return (
        <section className="featured-offers">
            <div className="container">
                <h2 className="col-span-4 title-selection">Our Featured Offers</h2>
                <div className="grid">

                    {collections.map((collection:any) => (
                        <div className="grid-item ">
                        
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
                                    width={600}
                                />
                                <h3 className="link-hover">{collection.title}</h3>
                                <p>{collection.description}</p>

                                <span className="btn btn-discover">
                                    Discover
                                    <img src={iconchevronright} alt="discover" />
                                    
                                </span>
                            </Link>

                        </div>
                        
                    ))}

                </div>
            </div>
                
        </section>
    )
}