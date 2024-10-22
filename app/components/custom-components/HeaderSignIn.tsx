import React, { useState, useRef, useEffect } from 'react';
import iconmenu from '~/assets/fonts/icons/icon-menu.svg';
import iconuser from '~/assets/fonts/icons/icon-user.svg';
import { IconUser } from './icons/IconUser';

export default function HeaderSignIn() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null); 

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);


    return (
        <div className="header-cta__block relative inline-block text-left" ref={dropdownRef}>
            <div className='btn-user'>
                <button
                    type="button"
                    className="w-full justify-center gap-x-1.5 px-3 py-2 text-gray-900 shadow-sm hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={toggleDropdown} // Gán hàm toggleDropdown vào sự kiện onClick
                >
                    <IconUser 
                        color = {'#fff'}
                    />
                    <img src={iconmenu} alt="" />

                </button>
            </div>

            {isOpen && (
                <div
                    className="header-cta__block-expand absolute z-10 mt-2 bg-white shadow-lg focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                >
                    
                    <a
                        href="/account"
                        className="block px-4 py-2"
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item-1"
                    >
                        <strong>Login</strong>
                    </a>
                    <div className="border-b border-gray-200"></div>

                    <a
                        href="#"
                        className="block px-4 py-2"
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item-2"
                    >
                        Wishlist
                    </a>
                    <div className="border-b border-gray-200"></div>
                    <a
                        href="#"
                        className="block px-4 py-2"
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item-3"
                    >
                        Track order
                    </a>
                    <a
                        href="#"
                        className="block px-4 py-2"
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item-4"
                    >
                        Help center
                    </a>
                    <a
                        href="#"
                        className="block px-4 py-2"
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item-4"
                    >
                        FaQ
                    </a>
                </div>
            )}
        </div>
    );
}
