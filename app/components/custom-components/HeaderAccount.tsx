import React, { useState } from 'react';
import iconmenu from '~/assets/fonts/icons/icon-menu.svg';
import iconuser from '~/assets/fonts/icons/icon-user.svg';

export default function HeaderAccount(){
    // Khởi tạo state cho trạng thái hiển thị của dropdown
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Hàm xử lý sự kiện mở/đóng dropdown
    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className="relative inline-block text-left">

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
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1" role="none">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700"
                            role="menuitem"
                            tabIndex={-1}
                            id="menu-item-0"
                        >
                            Account settings
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700"
                            role="menuitem"
                            tabIndex={-1}
                            id="menu-item-1"
                        >
                            Support
                        </a>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700"
                            role="menuitem"
                            tabIndex={-1}
                            id="menu-item-2"
                        >
                            License
                        </a>
                        <form method="POST" action="#" role="none">
                            <button
                                type="submit"
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                role="menuitem"
                                tabIndex={-1}
                                id="menu-item-3"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}