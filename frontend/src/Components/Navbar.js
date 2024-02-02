import React, { useState, useEffect, useRef } from 'react';
// import { FaGear } from 'react-icons/fa6';
import { MdContactMail } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../ContextProvider/UserContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, imageUrl, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Call the logout function from the UserContext and redirect to the login page
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className='flex justify-center items-center gap-10 text-xs md:text-lg'>
            {/* <div className='flex justify-center items-center gap-2'><FaGear size={28}/> Setting</div> */}
            <a href="mailto:vivekanandaj867@gmail.com" target='_blank' rel="noopener noreferrer">
            <div className='flex justify-center items-center gap-2'><MdContactMail size={28}/> Developer Contact</div>
            </a>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isLoggedIn ? (
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  onClick={toggleDropdown}
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={imageUrl || 'https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg'}
                    alt=""
                  />
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Link to="/login" className="text-gray-700">Login</Link>
                <span className="mx-2 text-gray-700">|</span>
                <Link to="/signup" className="text-gray-700">Signup</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
