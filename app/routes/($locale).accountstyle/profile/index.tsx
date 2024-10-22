import React, { useState, useEffect } from 'react';
import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';

export const handle = {
  breadcrumbType :'account'
}


export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return json({
      error: null,
      customer: data?.customerUpdate?.customer,
    });
  } catch (error: any) {
    return json(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const { state } = useNavigation();
  const action = useActionData<ActionResponse>();

  // Initialize customer info
  const customer = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phone: '',
    dateOfBirth: '',
    gender: 'Private',
  };

  // Local state for form data
  const [formData, setFormData] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    dateOfBirth: customer.dateOfBirth,
    gender: customer.gender,
  });

  // Local state for tracking form changes
  const [hasChanges, setHasChanges] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Detect changes in formData and set the hasChanges state
  useEffect(() => {
    const isFormChanged =
      formData.firstName !== customer.firstName ||
      formData.lastName !== customer.lastName ||
      formData.email !== customer.email ||
      formData.phone !== customer.phone ||
      formData.dateOfBirth !== customer.dateOfBirth ||
      formData.gender !== customer.gender;

    setHasChanges(isFormChanged);
  }, [formData]);

  return (
    <div className="account-profile">
      <h2 className='title'>My profile</h2>
      <br />
      <Form method="PUT" className="max-w-md mx-auto">
        <div className="grid md:grid-cols-2 md:gap-6">
          {/* First Name */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="firstName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
              
              placeholder=""
              aria-label="First name"
              defaultValue={customer.firstName}
              minLength={2}
              onChange={handleInputChange}
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              First name
            </label>
          </div>

          {/* Last Name */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="lastName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              aria-label="Last name"
              defaultValue={customer.lastName}
              minLength={2}
              onChange={handleInputChange}
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Last name
            </label>
          </div>

          {/* Email */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              aria-label="Email"
              defaultValue={customer.email}
              minLength={2}
              onChange={handleInputChange}
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Email address
            </label>
          </div>

          {/* Phone */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="tel"
              name="phone"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              onChange={handleInputChange}
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Phone number (123-456-7890)
            </label>
          </div>

          {/* Date of Birth */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="date"
              name="dateOfBirth"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
              placeholder=" "
              
              onChange={handleInputChange}
            />
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-focus:dark:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Date of birth
            </label>
          </div>

          {/* Gender */}
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="gender"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
              
              defaultValue={customer.gender}
              onChange={handleInputChange}
            >
              <option value="Private">Private</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Gender
            </label>
          </div>
        </div>

        {action?.error ? (
          <p>
            <mark>
              <small>{action.error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}

        <button
          className={`btn ${hasChanges ? 'bg-blue-500' : 'bg-gray-300'} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          type="submit"
          disabled={state !== 'idle'}
        >
          {state !== 'idle' ? 'Updating' : 'Save'}
        </button>
      </Form>
    </div>
  );
}

