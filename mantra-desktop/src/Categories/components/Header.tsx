import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ handleToggleDarkMode }) => {
  return (
    <div className="header">
      <Link to="/categories">Categories</Link>
      <button
        onClick={() =>
          handleToggleDarkMode(previousDarkMode => !previousDarkMode)
        }
        className="save"
      >
        Toggle Mode
      </button>
    </div>
  );
};

export default Header;
