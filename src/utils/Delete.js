import axios from "axios";
import { NotificationManager } from "react-notifications";
import Swal from "sweetalert2";

export const DeleteEntity = async (entity, id) => {
  // alert(entity)
  const BASE_URL = `http://localhost:5000`;
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#045D78",
      cancelButtonColor: "#f5365c",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      switch (entity) {
        case "Country":
          await axios.delete(`${BASE_URL}/countries/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "Category":
          await axios.delete(`${BASE_URL}/categories/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "Coupon":
          await axios.delete(`${BASE_URL}/coupons/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "PaymentGateWay":
          await axios.delete(`${BASE_URL}/payment-methods/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "Enquiry":
          await axios.delete(`${BASE_URL}/enquiries/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "PayOutList":
          await axios.delete(`${BASE_URL}/payout-settings/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "Property":
          await axios.delete(`${BASE_URL}/properties/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "ExtraImages":
          await axios.delete(`${BASE_URL}/extra/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "Facility":
          await axios.delete(`${BASE_URL}/facilities/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "Gallery":
          await axios.delete(`${BASE_URL}/galleries/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "GalleryCategory":
          await axios.delete(`${BASE_URL}/galleryCategories/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "Package":
          await axios.delete(`${BASE_URL}/packages/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "Page":
          await axios.delete(`${BASE_URL}/pages/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "FAQ":
          await axios.delete(`${BASE_URL}/faqs/delete/${id}`, {
            withCredentials: true,
          });
          break;

        case "UserList":
          await axios.delete(
            `${BASE_URL}/users/user/delete/${id}?forceDelete=true`,
            {
              withCredentials: true,
            }
          );
          break;

        case "Admin":
          await axios.delete(
            `${BASE_URL}/admin/delete/${id}?forceDelete=true`,
            { withCredentials: true }
          );
          break;

        case "Role":
          // alert(id)
          await axios.delete(
            `${BASE_URL}/rollrequest/delete/${id}?forceDelete=true`,
            { withCredentials: true }
          );
          break;

        case "Property":
          await axios.delete(
            `${BASE_URL}/properties/delete/${id}?forceDelete=true`,
            {
              withCredentials: true,
            }
          );
          break;

        default:
          throw new Error(`Unknown entity: ${entity}`);
      }
      NotificationManager.removeAll();
      NotificationManager.success(`${entity} deleted successfully!`);
      return true;
    } else {
      NotificationManager.removeAll();
      NotificationManager.info(`${entity} deletion was cancelled.`);
      return false;
    }
  } catch (error) {
    NotificationManager.removeAll();
    console.error(error);
    NotificationManager.error(`Failed to delete ${entity}.`);
    throw error;
  }
};
