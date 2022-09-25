import React from 'react';

const DeleteConfirmModal = ({ handleDeleteTrue, handleDeleteFalse }) => {
  return (
    <div className="modal">
      <div className="modal_box">
        <p>You sure you wanna delete?</p>
        <button className="modal_buttonCancel" onClick={handleDeleteFalse}>Cancel</button>
        <button onClick={handleDeleteTrue} className="modal_buttoDelete">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
