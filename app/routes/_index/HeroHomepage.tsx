import { Link } from "@remix-run/react";
import { Image } from "@shopify/hydrogen";

// Swiper
import { Navigation,  Pagination as PaginationSwiper  } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';


export default function HeroHomepage(
    {collections} : {collections: any}
){
    // console.log(collections) // For debugging purposes
    const {hero, heroList} = collections;

    return (
        <section className="hero-homepage">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-4 gap-0 h-full">
                    <div className="hightlight col-span-2 sm:col-span-1 md:col-span-2 h-auto md:h-full flex flex-col">
                        <Link 
                            className="collection-item group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
                            key={hero[0].id}
                            to={`/c/${hero[0].handle}`}
                            prefetch="intent"
                        >
                            <Image
                                alt={hero[0].image.altText || 'image alttext'} 
                                data={hero[0].image}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                            />
                            <div className="collection-item__content">
                                <button className="btn btn-tag tag">
                                    New arrival
                                </button>
                                <h2> {hero[0].title}</h2>
                                <p>{hero[0].description}</p>
                            </div>
                            
                        </Link>
                    </div>

                    <div className="col-span-2 sm:col-span-1 md:col-span-1">
                        <div className="group relative flex flex-col overflow-hidden rounded-lg mb-4">

                            <Link 
                                className="collection-item group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
                                key={hero[1].id}
                                to={`/c/${hero[1].handle}`}
                                prefetch="intent"
                            >
                                <Image
                                    // alt={image.altText || 'Color option image'}  // Cung cấp giá trị cho thuộc tính alt
                                    data={hero[1].image}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-150 ease-in-out"
                                />
                                <div className="collection-item__content">
                                    <h2> {hero[1].title}</h2>
                                    <p>{hero[1].description}</p>
                                </div>
                                
                            </Link>
                        </div>

                        <div className="group relative flex flex-col overflow-hidden rounded-lg">
                            <Link 
                                className="collection-item group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
                                key={hero[2].id}
                                to={`/c/${hero[2].handle}`}
                                prefetch="intent"
                            >
                                <Image
                                    // alt={image.altText || 'Color option image'}  // Cung cấp giá trị cho thuộc tính alt
                                    data={hero[2].image}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-150 ease-in-out"
                                />
                                <div className="collection-item__content">
                                    <h2> {hero[2].title}</h2>
                                    <p>{hero[2].description}</p>
                                </div>

                            </Link>
                        </div>
                    </div>


                    <div className="col-span-3 sm:col-span-1 md:col-span-3 h-auto md:h-full flex">


                        <div className="hero-list">
                            {heroList.map((item:any) => (
                                <Link 
                                    key={item.id}
                                    className="hero-list__item link-primary"
                                    to={`/c/${item.handle}`}
                                    prefetch="intent"
                                >
                                    <Image
                                        alt={item.image.altText || "No description"}
                                        data={item.image}
                                        loading="lazy"
                                        className=""
                                        width='100'
                                    />
                                    <h3 className="link-hover">{item.title}</h3>
                                </Link>
                            ))}
                        </div>



                        {/* <div className="hero-list">
                        <Swiper
                            modules={[Navigation, PaginationSwiper]}
                            spaceBetween={16}
                            slidesPerView={6}
                            navigation= {{
                            prevEl: '.carousel-btn-prev.hero-list__swiper-prev',
                            nextEl: '.carousel-btn-next.hero-list__swiper-next',
                            
                            }}
                            pagination={{ 
                                el: '.images-pagination',
                                type: 'fraction' 
                            }}

                            breakpoints={{
                                // Kích thước màn hình nhỏ hơn hoặc bằng 1200px
                                1200: {
                                    slidesPerView: 6, // Hiển thị 5 slides
                                },
                                // Kích thước màn hình nhỏ hơn hoặc bằng 992px
                                992: {
                                    slidesPerView: 4, // Hiển thị 4 slides
                                },
                                // Kích thước màn hình nhỏ hơn hoặc bằng 768px
                                768: {
                                    slidesPerView: 'auto', // Hiển thị 3 slides
                                },
                                // Kích thước màn hình nhỏ hơn hoặc bằng 576px
                                576: {
                                    slidesPerView: 'auto', // Hiển thị 2 slides
                                },
                                
                                // Mặc định: 1 slide
                                0: {
                                    slidesPerView: 'auto', // Hiển thị 1 slide
                                },
                            }}
                        >
                            {heroList.map((item:any) => (
                            
                            <SwiperSlide>
                                <Link 
                                    key={item.id}
                                    className="hero-list__item link-primary"
                                    to={`/c/${item.handle}`}
                                    prefetch="intent"
                                >
                                    <Image
                                        alt={item.image.altText || "No description"}
                                        data={item.image}
                                        loading="lazy"
                                        className=""
                                        width='100'
                                    />
                                    <h3 className="link-hover">{item.title}</h3>
                                </Link>
                            </SwiperSlide>
                            
                            ))}

                            <div className="carousel-btn-prev hero-list__swiper-prev">
                                <img src={iconchevronleft} alt="" width='24px' height='auto' />
                                </div>
                                <div className="carousel-btn-next hero-list__swiper-next">
                                <img src={iconchevronright} alt=""  width='24px' height='auto'/>
                            </div>

                        </Swiper>
                        </div>
                         */}
                    </div>
                
                </div>
            </div>
        </section>
    )
}