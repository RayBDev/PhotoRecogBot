import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#6a6293] py-5">
      <div className="container text-white">
        © Copyright {new Date().getFullYear()} Photo RecogBot by Ray Bernard
      </div>
    </footer>
  );
};

export default Footer;
