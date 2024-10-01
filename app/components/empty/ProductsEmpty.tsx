import { Link } from "@remix-run/react";
import emptycollection from '~/assets/images/empty-collection.svg';


type ProductsEmpty = {
    title?: string;
}

export default function ProductsEmpty({title} : ProductsEmpty){
    return(
        <section className="empty-collection__section">
            <div className="container mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-8 col-start-3 text-center">
                        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
                        <div className="mt-4 empty-collection">
                            <img src={emptycollection} alt="Looks like you haven't added anything yet, let's get you 
                                started!" />
                            <h2 className="text-xl">No products found</h2>
                            <p className="mt-2">Sorry, This collection currently has no products.
                            </p>
                        </div>
                        <Link
                            className="btn btn-primary mt-4 " 
                            to="/"
                            prefetch="intent"
                        >
                            <span>Return to homepage</span>
                            
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}