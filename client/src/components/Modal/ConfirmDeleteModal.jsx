// src/components/Modal/ConfirmDeleteModal.jsx
import React from "react";

const ConfirmDeleteModal = ({ setShowDeleteModal, onConfirm, taskTitle }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-black">"{taskTitle}"</span>? <br />
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
