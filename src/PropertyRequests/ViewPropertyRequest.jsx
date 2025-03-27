import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import api from "../utils/api";
import Header from "../components/Header";
import PropotiesHeader from "./PropotiesHeader";
import Swal from "sweetalert2";
import "../App.css";

const ViewProperty = () => {
  const { id } = useParams(); // Get the property ID from the URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch property details by ID
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/properties/${id}`);
        if (response.status === 200) {
          setProperty(response.data);
        }
      } catch (err) {
        console.error(
          "Error fetching property:",
          err.response ? err.response.data : err.message
        );
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Handle image rendering (main image and extra images)
  const renderImages = (mainImage, extraImages) => {
    const images = [];
    if (mainImage) {
      images.push(
        <img
          key="main"
          src={mainImage}
          alt="Main Property Image"
          className="w-48 h-48 object-cover rounded-md"
          onError={(e) => {
            e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
          }}
        />
      );
    }
    if (Array.isArray(extraImages) && extraImages.length > 0) {
      extraImages.forEach((img, index) => {
        images.push(
          <img
            key={index}
            src={img}
            alt={`Extra Image ${index + 1}`}
            className="w-48 h-48 object-cover rounded-md"
            onError={(e) => {
              e.target.src = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
            }}
          />
        );
      });
    }
    return images.length > 0 ? (
      <div className="flex flex-wrap gap-4">{images}</div>
    ) : (
      <span>No Images Available</span>
    );
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/property-request");
  };

  // Verify property (Accept/Reject)
  const handleVerifyProperty = async (type) => {
    const data = {
      property_id: id,
      type: type,
    };
    try {
      const response = await api.post("/properties/property-verify", data);
      if (response.status === 200) {
        // Navigate only after successful API call and Swal confirmation
        return true; // Indicate success for Swal
      }
    } catch (error) {
      console.error("Error verifying property:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: `Failed to ${type === 1 ? "accept" : "reject"} property. Please try again.`,
        icon: "error",
      });
      return false; // Indicate failure
    }
  };

  // SweetAlert confirmation
  const sweet = async (type) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are ${type === 1 ? "accepting" : "rejecting"} the property terms and conditions`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${type === 1 ? "Accept" : "Reject"}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await handleVerifyProperty(type);
        if (success) {
          Swal.fire({
            title: `${type === 1 ? "Accepted" : "Rejected"}`,
            text: `Property has been ${type === 1 ? "accepted" : "rejected"} successfully.`,
            icon: "success",
          }).then(() => {
            navigate("/request-property"); // Navigate after confirmation
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-1 flex-col bg-[#f7fbff]">
        <Header />
        <PropotiesHeader name="Properties Details" />
        <div className="px-6 w-[79vw]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <img width={100} src="/image/Hotels Search.gif" alt="loading" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-semibold p-10">
              {error}
              <button
                className="mt-4 bg-[#045D78] text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleBack}
              >
                Back to Properties
              </button>
            </div>
          ) : property ? (
            <div className="bg-white rounded-xl border border-[#EAE5FF] p-8 shadow-lg h-[71vh] overflow-scroll overflow-x-hidden scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Title:</strong>
                    <span className="text-gray-900">{property.title || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Price:</strong>
                    <span className="text-gray-900">₹{property.price || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Address:</strong>
                    <span className="text-gray-900">{property.address || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Mobile:</strong>
                    <span className="text-gray-900">{property.mobile || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Description:</strong>
                    <span className="text-gray-900">{property.description || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Extra Guest Charges:</strong>
                    <span className="text-gray-900">₹{property.extra_guest_charges || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Square Footage:</strong>
                    <span className="text-gray-900">{property.sqrft || "N/A"} sq ft</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Adults:</strong>
                    <span className="text-gray-900">{property.adults || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Children:</strong>
                    <span className="text-gray-900">{property.children || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Infants:</strong>
                    <span className="text-gray-900">{property.infants || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Pets:</strong>
                    <span className="text-gray-900">{property.pets ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Beds:</strong>
                    <span className="text-gray-900">{property.beds || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Bathrooms:</strong>
                    <span className="text-gray-900">{property.bathroom || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Latitude:</strong>
                    <span className="text-gray-900">{property.latitude || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Longitude:</strong>
                    <span className="text-gray-900">{property.longtitude || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-700 w-40">Rate:</strong>
                    <span className="text-gray-900">{property.rate || "N/A"}/5</span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-6 space-y-4">
                <div>
                  <strong className="text-gray-700">Images:</strong>
                  <div className="mt-2 flex flex-col">{renderImages(property.image, property.extra_images)}</div>
                </div>
                <div>
                  <strong className="text-gray-700">Facilities:</strong>
                  <span className="text-gray-900 ml-2">
                    {Array.isArray(property.facility) ? property.facility.join(", ") : property.facility || "N/A"}
                  </span>
                </div>
                <div>
                  <strong className="text-gray-700">Rules:</strong>
                  <ul className="list-disc pl-6 mt-2 text-gray-900">
                    {Array.isArray(property.rules) && property.rules.length > 0 ? (
                      property.rules.map((rule, index) => <li key={index}>{rule}</li>)
                    ) : (
                      <li>No Rules Specified</li>
                    )}
                  </ul>
                </div>
                <div>
                  <strong className="text-gray-700">Standard Rules:</strong>
                  {property.standard_rules ? (
                    <ul className="list-disc pl-6 mt-2 text-gray-900">
                      <li>Check In: {property.standard_rules.checkIn || "N/A"}</li>
                      <li>Check Out: {property.standard_rules.checkOut || "N/A"}</li>
                      <li>Smoking Allowed: {property.standard_rules.smokingAllowed ? "Yes" : "No"}</li>
                    </ul>
                  ) : (
                    <span className="text-gray-900 ml-2">N/A</span>
                  )}
                </div>
                <div>
                  <strong className="text-gray-700">Listing Date:</strong>
                  <span className="text-gray-900 ml-2">{property.listing_date || "N/A"}</span>
                </div>
                <div>
                  <strong className="text-gray-700">Video URL:</strong>
                  <span className="text-gray-900 ml-2">{property.video_url || "N/A"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                {property.accept === null || property.accept === undefined ? (
                  <>
                    <button
                      className="bg-[#cbe8d0] font-bold text-[#33d651] text-[12px] px-6 py-2 rounded hover:bg-[#7ca583] transition"
                      onClick={() => sweet(1)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-[#efa1a1] text-xs font-bold text-[#eb3434] px-6 py-2 rounded hover:bg-[#c35d5d] transition"
                      onClick={() => sweet(0)}
                    >
                      Reject
                    </button>
                  </>
                ) : property.accept === 1 ? (
                  <button className="bg-[#33d651] text-white px-6 py-2 rounded font-bold cursor-not-allowed" disabled>
                    Accepted
                  </button>
                ) : (
                  <button className="bg-[#eb3434] text-white px-6 py-2 rounded font-bold cursor-not-allowed" disabled>
                    Rejected
                  </button>
                )}
                <button
                  className="bg-[#045D78] text-white px-6 py-2 rounded hover:bg-[#21444f] transition flex items-center gap-2"
                  onClick={handleBack}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 font-semibold p-10">
              No property found
              <button
                className="mt-4 bg-[#045D78] text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleBack}
              >
                Back to Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProperty;