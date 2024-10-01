import React, { useState, useRef, useEffect } from 'react';
import iconmenu from '~/assets/fonts/icons/icon-menu.svg';
import iconuser from '~/assets/fonts/icons/icon-user.svg';

export default function HeaderSignIn() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Tạo tham chiếu đến dropdown

    // Hàm xử lý sự kiện mở/đóng dropdown
    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    // Hàm xử lý click ngoài dropdown
    const handleClickOutside = (event: MouseEvent) => {
        // Kiểm tra nếu click bên ngoài vùng dropdown và button thì đóng dropdown
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    // useEffect để lắng nghe sự kiện click toàn bộ document
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Dọn dẹp sự kiện khi component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);


    return (
        <div className="header-cta__block relative inline-block text-left" ref={dropdownRef}>
            <div className='btn-user'>
                <button
                    type="button"
                    className="w-full justify-center gap-x-1.5 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={toggleDropdown} // Gán hàm toggleDropdown vào sự kiện onClick
                >
                    <img src={iconuser} alt="" />
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
