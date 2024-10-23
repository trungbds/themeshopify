import { useEffect, useRef, useState } from 'react';
import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import noImage from '~/assets/images/no-image-available.png';

export default function AllCategories({ collectionsList }: { collectionsList: any }) {
    const { items } = collectionsList;
    const listRef = useRef<HTMLDivElement>(null);
    const [scrollThumbWidth, setScrollThumbWidth] = useState(0);
    const [scrollThumbLeft, setScrollThumbLeft] = useState(0);

    // Tính toán kích thước của thanh cuộn "thumb"
    useEffect(() => {
        const updateScrollThumb = () => {
            const list = listRef.current;
            if (list) {
                const visibleRatio = list.clientWidth / list.scrollWidth;
                setScrollThumbWidth(visibleRatio * list.clientWidth);
                setScrollThumbLeft((list.scrollLeft / list.scrollWidth) * list.clientWidth);
            }
        };

        const list = listRef.current;
        if (list) {
            list.addEventListener('scroll', updateScrollThumb);
            updateScrollThumb(); // Gọi hàm tính toán khi khởi tạo
        }

        return () => {
            if (list) {
                list.removeEventListener('scroll', updateScrollThumb);
            }
        };
    }, []);

    return (
        <section className="all-categories">
            <div className="container">
                <div className="flex flex-wrap -mb-px items-baseline all-categories-list-container">
                    <h2 className="title-selection">All categories</h2>

                    <div className="all-categories__list-wrapper" style={{ position: 'relative' }}>
                        <div className="all-categories__list" ref={listRef}>
                            {items.map((item: any, index: number) => (
                                <Link
                                    key={index}
                                    to="/"
                                    className={`all-categories__item link-primary`}
                                    aria-current={index ? 'page' : undefined}
                                >
                                    <Image
                                        data={item.resource?.image}
                                        sizes="(min-width: 45em) 50vw, 100vw"
                                        aspectRatio="2/3"
                                    />
                                    <h4 className="link-hover">{item.title}</h4>
                                </Link>
                            ))}
                        </div>

                        {/* Thanh cuộn tùy chỉnh */}
                        <div className="custom-scrollbar">
                            <div
                                className="custom-scrollbar-thumb"
                                style={{
                                    width: `${scrollThumbWidth}px`,
                                    left: `${scrollThumbLeft}px`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
