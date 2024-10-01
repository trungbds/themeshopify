import { Link } from "@remix-run/react";
import routeerror from '~/assets/images/404.svg';


type RouteErrorProps = {
    errorStatus: number;
    errorMessage?: string;
}

export default function RouteError({errorStatus, errorMessage} : RouteErrorProps){
    return(
        <section className="route-error__section">
            <div className="container mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-8 col-start-3 text-center">
                        
                        <div className="route-error">
                            <img className="mx-auto" src={routeerror} alt="Looks like you haven't added anything yet, let's get you started!" />
                            <h1>Oops ! </h1>
                            {errorMessage && (
                            <fieldset>
                                <pre>{errorMessage}</pre>
                            </fieldset>
                            )}
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