import { NotificationManager } from "react-notifications";
import api from "./api";

const BASE_URL = api;

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
        url = "categories/toggle-status";
        break;
      case "Property":
        url = `properties/toggle-status`;
        break;
      case "Panorama":
        url = `properties/toggle-panorama`;
        break;
      case "ExtraImage":
        url = `extra/toggle-status`;
        break;
      case "Facility":
        url = `facilities/toggle-status`;
        break;
      case "Package":
        url = `packages/toggle-status`;
        break;
      case "Coupon":
        url = `coupons/toggle-status`;
        break;
      case "UserList":
        url = `users/user/toggle-update`;
        break;
      case "Payment":
        url = `payment-methods/toggle-status`;
        break;
      case "FAQ'S":
        url = `faqs/toggle-status`;
        break;
      case "Country":
        url = `countries/toggle-status`;
        break;
      case "City":
        url = `cities/toggle-status`;
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
    const response = await api.patch(
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
