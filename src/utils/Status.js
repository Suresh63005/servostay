import axios from "axios";
import { NotificationManager } from "react-notifications";

const BASE_URL = `http://localhost:5000`; // Ensure this matches your backend URL

export const StatusEntity = async (
  entityType,
  id,
  currentStatus,
  setData,
  data,
  field = "status"
) => {
  try {
    const newStatus = currentStatus === 1 ? 0 : 1;
    let url;

    switch (entityType) {
      case "Category":
        url = `${BASE_URL}/categories/toggle-status`;
        break;
      case "Property":
        url = `${BASE_URL}/properties/toggle-status`;
        break;
      case "Panorama":
        url = `${BASE_URL}/properties/toggle-panorama`;
        break;
      case "ExtraImage":
        url = `${BASE_URL}/extra/toggle-status`;
        break;
      case "Facility":
        url = `${BASE_URL}/facilities/toggle-status`;
        break;
      case "Package":
        url = `${BASE_URL}/packages/toggle-status`;
        break;
      case "Coupon":
        url = `${BASE_URL}/coupons/toggle-status`;
        break;
      case "UserList":
        url = `${BASE_URL}/users/user/toggle-update`;
        break;
      case "Payment":
        url = `${BASE_URL}/payment-methods/toggle-status`;
        break;
      case "FAQ'S":
        url = `${BASE_URL}/faqs/toggle-status`;
        break;
      case "Country":
        url = `${BASE_URL}/countries/toggle-status`;
        break;
      default:
        throw new Error(`Invalid entity type: ${entityType}`);
    }

    // Log the URL and request payload for debugging
    console.log(`URL: ${url}`);
    console.log(
      `Request Payload: id=${id}, field=${field}, value=${newStatus}`
    );

    // Send the request to toggle the status
    const response = await axios.patch(
      url,
      {
        id,
        field,
        value: newStatus,
      },
      { withCredentials: true }
    );

    // Update the local state if successful
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, [field]: newStatus } : item
    );
    console.log("Updated Data:", updatedData);
    setData(updatedData);

    let successMessage;
    if (entityType === "Panorama" && field === "is_panorama") {
      successMessage = `Property Panorama updated successfully!`;
    } else {
      successMessage = `${entityType} ${field} updated successfully!`;
    }

    NotificationManager.removeAll();
    NotificationManager.success(successMessage);
  } catch (error) {
    console.error("Error updating status:", error);
    NotificationManager.removeAll();
    NotificationManager.error("An error occurred while updating the status.");
  }
};
