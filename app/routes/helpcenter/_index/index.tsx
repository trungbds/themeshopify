import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, type MetaFunction } from '@remix-run/react'; 
import iconpackage from '~/assets/fonts/icons/icon-package.svg';
import helpcontact from '~/assets/images/help-contact.png'
import { IconTrackOrder } from '~/components/custom-components/icons/IconTrackOrder';
import { IconPackageReturn } from '~/components/custom-components/icons/IconPackageRerurn';
import { IconFaq } from '~/components/custom-components/icons/IconFaq';
import { IconPolicies } from '~/components/custom-components/icons/IconPolicies';



export const handle = {
  breadcrumbType: 'helpcenter',
};

export const meta: MetaFunction = () => {
  return [{title: `Bestspend | Help Center`}];
};




export default function HelpCenter() {



  
  return(
    <section>
      <div className="container">
        
        <h1 className='page-title' >Help Center</h1>

        <div className='help-grid'>
          <h2 className="help-grid__title">
            What do you need help with?
          </h2>


          <Link 
            to='/account/orders'
            className='help-grid__item'>
            <IconTrackOrder />
            <h3 className='title'> Track your order </h3>
          </Link>

          <Link 
            to='/'
            className='help-grid__item'>

            <IconPackageReturn />
            <h3 className='title'> Returns & Exchanges </h3>
          </Link>

          <Link 
            to='/faqs'
            className='help-grid__item'
            
            
          >
            <IconFaq />
            <h3 className='title'> FAQs </h3>
          </Link>

          <Link 
            to='/policies/privacy-policy'
            className='help-grid__item'>

            <IconPolicies />
            <h3 className='title'> Manage Account </h3>
          </Link>
          <Link 
            to='/'
            className='help-grid__item'>

            <IconTrackOrder />
            <h3 className='title'> Get Product Support </h3>
          </Link>
          <Link 
            to='/'
            className='help-grid__item'>

            <IconTrackOrder />
            <h3 className='title'> Manage Membership </h3>
          </Link>


          <Link 
            to='/'
            className='help-grid__item'>

            <IconTrackOrder />
            <h3 className='title'>BestSpend Credit Card </h3>
          </Link>

          <Link 
            to='/'
            className='help-grid__item'>

            <IconTrackOrder />
            <h3 className='title'>Plans & Subscriptions</h3>
          </Link>

          <Link 
            to='/'
            className='help-grid__item'>

            <IconTrackOrder />
            <h3 className='title'>Price Match Guarantee</h3>
          </Link>

          <Link 
            to='/'
            className='help-grid__item'>

            <IconTrackOrder />
            <h3 className='title'>Trade-In Program</h3>
          </Link>


        </div>

        <div className="help-contact">
          <div className="help-contact__detail">
            <div className="help-contact__title">
              <h3>We're here to help you !</h3>
              <p className='help-contact__text'>Faster, better support</p>
            </div>
            
            <Link to='/' className='btn help-contact__link'>Contact Us</Link>
            <Link to='/' className='btn help-contact__link'>Live chat </Link>
            <img src={helpcontact} alt="" className='bg-img'/>
          </div>
        </div>


      </div>

      
      
    </section>
  )
}

