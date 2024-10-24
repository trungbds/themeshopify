import { Link } from '@remix-run/react';
import React, { useState, useRef, useEffect } from 'react';
import iconlivehelp from '~/assets/fonts/icons/icon-livehelp.svg';
import { IconDefaultLiveHelp } from './icons/default/IconDefaultLiveHelp';

export default function HeaderSupportBtn() {
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
            <div className="btn-support">
                <button
                    type="button"
                    className="w-full justify-center gap-x-1.5 px-3 py-2"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={toggleDropdown}
                >
                    <IconDefaultLiveHelp />
                    <span> Support </span>
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
                    <Link 
                        to={'/'}
                        className="block px-4 py-2"
                        role="menuitem"
                    >
                        Live chat
                    </Link>
                    <Link 
                        to={'/contact'}
                        className="block px-4 py-2"
                        role="menuitem"
                    >
                        Contact Us
                    </Link>
                    <Link 
                        to={'/helpcenter'}
                        className="block px-4 py-2"
                        role="menuitem"
                    >
                        Help Center
                    </Link>
                    <Link 
                        to={'/faqs'}
                        className="block px-4 py-2"
                        role="menuitem"
                    >
                        FAQs
                    </Link>
                </div>
            )}
        </div>
    );
}
