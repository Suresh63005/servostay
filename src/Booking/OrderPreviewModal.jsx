import React, { useEffect, useState } from 'react';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { generateInvoicePdf } from '../utils/pdfUtils';

const OrderPreviewModal = ({ isOpen, closeModal,selectedProperty, downloadModalAsImage }) => {
    console.log(selectedProperty)

    const [bookingId,setBookingId]=useState(null)

    useEffect(() => {
        if (isOpen && selectedProperty?.id) {
          fetchBookingId(selectedProperty.id);
        }
      }, [isOpen, selectedProperty?.id]);
      const fetchBookingId = async (id) => {
        try {
          const response = await fetch(`http://localhost:5000/bookings/status/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: selectedProperty.book_status }),
          });
      
          if (!response.ok) {
            throw new Error(`Failed to fetch booking data: ${response.statusText}`);
          }
      
          const data = await response.json();
          setBookingId(data.data);
        } catch (error) {
          console.error("Error fetching booking data:", error.message);
        }
      };
    
      if (!isOpen || !bookingId) return null;
      if (!isOpen) return null;
      console.log(bookingId)
    const PdfFormat = () => {
        const dynamicData = {
          bookingId: bookingId.id,
          customerName: bookingId.User.name,
          customerMobile: bookingId.User.mobile,
          customerAddress: bookingId.properties.address,
          subtotal: selectedProperty.subtotal,
          totalDays: selectedProperty.total_day,
          tax: selectedProperty.tax,
          netAmount: selectedProperty.total,
          paymentGateway: "RazorPay",
          propertyTitle: bookingId.properties.title,
          checkInDate: bookingId.check_in,
          checkOutDate: bookingId.check_out,
          propertyAddress: bookingId.properties.address,
          transactionId: bookingId.transaction_id,
          bookingStatus: bookingId.book_status,
        };
      
        // Load the background image (optional)
        const backgroundImage = "/image/Frame 1984078701.png"; 
      
        generateInvoicePdf(dynamicData, backgroundImage);
      };
      
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" >
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" ></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform transition-transform duration-300 ease-in-out overflow-hidden rounded-lg bg-white text-left shadow-xl  sm:my-8 sm:w-full sm:max-w-2xl">
                        <div className="bg-white px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900" id="modal-title">Order Preview</h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-0 w-7  right-0 text-red-500 hover:text-red-700 "
                                aria-label="Close"
                                title='close'
                            >
                                &times; 
                            </button>
                            {/* Order Details */}
                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 ">
                                <div className=" font-medium text-gray-700">Order No:</div>
                                <div>#{bookingId?.id || 'N/A'}</div>
                                <div className=" font-medium text-gray-700">Order date:</div>
                                <div>{bookingId?.book_date || 'N/A'}</div>
                                <div className=" font-medium text-gray-700">Mobile Number:</div>
                                <div>+{bookingId.User?.mobile || 'N/A'}</div>
                                <div className=" font-medium text-gray-700">Customer Name:</div>
                                <div>{bookingId.User?.name || 'N/A'}</div>
                            </div>
                            {/* Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <button className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md text-white" onClick={PdfFormat}>
                                    <PictureAsPdfOutlinedIcon />
                                </button>
                            </div>
                            {/* Total Order */}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900">Total Order</h4>
                                <table className="mt-2 w-full border border-gray-300 text-sm">
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Subtotal</td>
                                            <td className="px-4 py-2 text-right">{bookingId?.subtotal || 0} ₹</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Total Day</td>
                                            <td className="px-4 py-2 text-right">{bookingId?.total_day || 0} Days</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Tax</td>
                                            <td className="px-4 py-2 text-right">{bookingId?.tax || 0} ₹</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700">Net Amount (Paid)</td>
                                            <td className="px-4 py-2 text-right">{bookingId?.total || 0} ₹</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Payment & Property Details & Check In and Out Information */}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900">Payment & Property Details & Check In and Out Information</h4>
                                <table className="mt-2 w-full border border-gray-300 text-sm">
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Payment Gateway?</td>
                                            <td className="px-4 py-2 text-right">RazorPay</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Property Title?</td>
                                            <td className="px-4 py-2 text-right">{bookingId.properties?.title || 'N/A'}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="px-4 py-2 font-medium text-gray-700">Property Image?</td>
                                            <td className="px-4 py-2 text-right">
                                                <a href={bookingId.properties.image || 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'} target='_blank' rel='noopener noreferrer'>
                                                {bookingId.properties.image ? (
                                                    <img
                                                        src={bookingId.properties.image}
                                                        alt="Property Image"
                                                        height={90}
                                                        width={90}
                                                        className="float-right object-cover rounded"
                                                        onError={(e) => {
                                                        e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
                                                        }}
                                                    />
                                                    ) : (
                                                    <img
                                                        src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                        alt="Placeholder Image"
                                                        height={90}
                                                        width={90}
                                                        className="float-right object-cover rounded"
                                                    />
                                                    )}

                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700">Property Check In Date?</td>
                                            <td className="px-4 py-2 text-right">{bookingId?.check_in || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-gray-700">Property Check Out Date?</td>
                                            <td className="px-4 py-2 text-right">{bookingId?.check_out || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Property & Booking Owner & Booking Status Details */}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900">Property & Booking Owner & Booking Status Details</h4>
                                <div className="grid gap-4 w-full sm:grid-cols-1 md:grid-cols-4 mt-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat] ">Property Address:</span>
                                        <span className='font-semibold'>{bookingId.properties?.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Booking Owner's Name:</span>
                                        <span>{bookingId.User?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Booking Owner Mobile:</span>
                                        <span className='font-semibold'>+ {bookingId.User?.mobile || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Transaction Id:</span>
                                        <span className='font-semibold'>{bookingId?.transaction_id || 'N/A'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-start text-[12px] font-[Montserrat]">Booking Status:</span>
                                        <span
                                            className={`font-semibold  ${
                                                bookingId.book_status === 'Cancelled' ? 'text-red-500' :
                                                bookingId.book_status === 'Completed' ? 'text-green-500' :
                                                bookingId.book_status === 'Booked' ? 'text-yellow-500' :
                                                bookingId.book_status === 'Confirmed' ? 'text-blue-500' :
                                                bookingId.book_status === 'Check_in' ? 'text-purple-500' :
                                                ''
                                            }`}
                                        >
                                            {bookingId?.book_status || 'N/A'}
                                        </span> 
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button" onClick={closeModal}
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPreviewModal;