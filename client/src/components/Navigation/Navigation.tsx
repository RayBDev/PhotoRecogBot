import React from 'react';
import { DetectionType, inputType, RouteType } from '../../App';
import { ReactComponent as ChevronIcon } from '../../assets/icons/triangle-down.svg';

type NavigationType = {
  onRouteChange: (route: RouteType) => void;
  onInputChange: (url?: string, type?: DetectionType) => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedIn: boolean;
  userName: string;
  input: inputType;
  entries: number;
};

const Navigation = ({
  onRouteChange,
  onInputChange,
  setShowModal,
  isSignedIn,
  userName,
  input,
  entries,
}: NavigationType) => {
  const loginHandler = (route: RouteType) => {
    onRouteChange(route);
    if (route === 'register' || route === 'signin') setShowModal(true);
  };

  return (
    <nav className="flex px-4 py-3 bg-blue-900 w-full text-white text-sm z-50">
      <div className="hidden md:block">
        <ul className="flex">
          <li className="mr-4">
            <button
              className="flex items-center"
              onClick={() => onInputChange(input.url, 'general')}
            >
              General <ChevronIcon className="fill-current w-4 h-4" />
            </button>
          </li>
          <li className="mr-4">
            <button
              className="flex items-center"
              onClick={() => onInputChange(input.url, 'face')}
            >
              Face <ChevronIcon className="fill-current w-4 h-4" />
            </button>
          </li>
          <li>
            <button
              className="flex items-center"
              onClick={() => onInputChange(input.url, 'apparel')}
            >
              Apparel <ChevronIcon className="fill-current w-4 h-4" />
            </button>
          </li>
        </ul>
      </div>
      <div className="ml-auto">
        {isSignedIn ? (
          <ul className="flex">
            <li className="mr-5">
              Hello {userName}, you've submitted {entries} photo(s)
            </li>
            <li>
              <button
                id="signout-button"
                onClick={() => loginHandler('signout')}
              >
                SignOut
              </button>
            </li>
          </ul>
        ) : (
          <ul className="flex">
            <li className="mr-4">
              <button id="login-btn" onClick={() => loginHandler('signin')}>
                Login
              </button>
            </li>
            <li>
              <button
                id="register-btn"
                onClick={() => loginHandler('register')}
              >
                Register
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
