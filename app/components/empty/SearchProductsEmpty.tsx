import { Link } from "@remix-run/react";
import searchproductfound from '~/assets/images/search-product-found.svg';


type SearchProductsEmpty = {
    title?: string;
}

export default function SearchProductsEmpty({title} : SearchProductsEmpty){
    return(
        <section className="empty-collection__section">
            <div className="container mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-8 col-start-3 text-center">
                        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
                        <div className="mt-4 empty-collection">
                            <img src={searchproductfound} alt="Looks like you haven't added anything yet, let's get you 
                                started!" />
                            <h2 className="text-xl">No products found</h2>
                            <p className="mt-2">No results match the applied filters.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}