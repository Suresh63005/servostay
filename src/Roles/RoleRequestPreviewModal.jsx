import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { generateInvoicePdf } from '../utils/pdfUtils';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

const RoleRequestPreviewModal = ({ isOpen, closeModal, selectedRequest }) => {
  const [requestData, setRequestData] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isOpen && selectedRequest?.id) {
      fetchRequestData(selectedRequest.id);
    }
  }, [isOpen, selectedRequest?.id]);

  const fetchRequestData = async (id) => {
    try {
      const response = await api.get(`/rollrequest/request/${id}`);
      setRequestData(response.data.viewRequest);
    } catch (error) {
      console.error('Error Fetching Request Data: ', error.message);
    }
  };

  if (!isOpen || !requestData) return null;

  const PdfFormate = () => {
    const dynamicData = {
      requestId: requestData.id,
      UserName: requestData.user?.name || 'N/A',
      RequestRole: requestData.requested_role,
      IdProofType: requestData.id_proof,
      IdProofImage: requestData.id_proof_img,
      Status: requestData.status,
      CreatedAt: requestData.created_at,
    };
    const backgroundImage = '/image/Frame 1984078701.png';
    generateInvoicePdf(dynamicData, backgroundImage);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform transition-transform duration-300 ease-in-out overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-2xl">
            <div className="bg-white px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
                Role Change Request Preview
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-0 w-7 right-0 text-red-500 hover:text-red-700"
                aria-label="Close"
                title="close"
              >
                &times;
              </button>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="font-medium text-gray-700">Request Id:</div>
                <div>#{requestData?.id || 'N/A'}</div>
                <div className="font-medium text-gray-700">User Name:</div>
                <div>{requestData?.user?.name || 'N/A'}</div>
                <div className="font-medium text-gray-700">Request Role:</div>
                <div>{requestData?.requested_role || 'N/A'}</div>
                <div className="font-medium text-gray-700">Id Proof:</div>
                <div>{requestData?.id_proof || 'N/A'}</div>
                <div className="font-medium text-gray-700">Id Proof Image:</div>
                <div>
                  {requestData?.id_proof_img ? (
                    <img
                      src={requestData.id_proof_img}
                      alt="ID Proof"
                      className="h-48 w-48 object-cover rounded-lg shadow-md border border-gray-300 cursor-pointer"
                      onClick={() => openImageModal(requestData.id_proof_img)}
                    />
                  ) : (
                    'N/A'
                  )}
                </div>
                <div className="font-medium text-gray-700">Status:</div>
                <div>{requestData?.status || 'N/A'}</div>
                <div className="font-medium text-gray-700">Created At:</div>
                <div>{new Date(requestData?.created_at).toLocaleString() || 'N/A'}</div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md text-white" onClick={PdfFormate}>
                  <PictureAsPdfOutlinedIcon />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={closeImageModal}>
          <div className="relative p-4">
            <img
              src={selectedImage}
              alt="ID Proof Large"
              className="max-w-full max-h-screen rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-1 text-red-500 text-3xl font-bold"
              onClick={closeImageModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleRequestPreviewModal;
