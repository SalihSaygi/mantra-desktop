import React from 'react';

interface Props {
  handleToggleDarkMode: React.Dispatch<React.SetStateAction<boolean>>

}

const Header: React.FC<Props> = ({ handleToggleDarkMode }) => {
  return (
    <div className="header">
      <h1>Notes</h1>
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
