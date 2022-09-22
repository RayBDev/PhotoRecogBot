import React from 'react';

type PropTypes = {
  children: React.ReactNode;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal = ({ children, setShowModal }: PropTypes) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-90 overflow-y-auto h-full w-full"
        id="modal"
        onClick={() => setShowModal(false)}
      ></div>
      {children}
    </>
  );
};

export default Modal;
