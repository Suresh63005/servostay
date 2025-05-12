import { NotificationManager } from "react-notifications";
import Swal from "sweetalert2";
import api from "./api";

export const DeleteEntity = async (entity, id) => {
  // alert(entity)
  const BASE_URL = api;
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
          await api.delete(`countries/delete/${id}`);
          break;

        case "Category":
          await api.delete(`categories/delete/${id}`, { params: { forceDelete: true } });
          break;

        case "Coupon":
          await api.delete(`coupons/delete/${id}`);
          break;

        case "PaymentGateway":
          await api.delete(`payment-methods/delete/${id}`);
          break;

        case "Enquiry":
          await api.delete(`enquiries/delete/${id}`);
          break;

        case "PayOutList":
          await api.delete(`payout-settings/delete/${id}`);
          break;

        // case "Property":
        //   await api.delete(`properties/delete/${id}`);
        //   break;

        case "Extra Image":
          await api.delete(`extra/delete/${id}`,{params:{forceDelete:true}});
          break;

        case "Facility":
          await api.delete(`facilities/delete/${id}`, { params: { forceDelete: true } });
          break;

        case "Gallery":
          await api.delete(`galleries/delete/${id}`);
          break;

        case "GalleryCategory":
          await api.delete(`galleryCategories/delete/${id}`);
          break;

        case "Package":
          await api.delete(`packages/delete/${id}`);
          break;

        case "Page":
          await api.delete(`pages/delete/${id}`);
          break;

        case "FAQ":
          await api.delete(`faqs/delete/${id}`, { params: { forceDelete: true} });
          break;

        case "User":
          await api.delete(`admin/delete-user-by-admin/${id}`,{params:{forceDelete:true}});
          break;

        case "Admin":
          await api.delete(`admin/delete/${id}?forceDelete=true`);
          break;

        case "Role":
          // alert(id)
          await api.delete(`rollrequest/delete/${id}?forceDelete=true`);
          break;

        case "Property":
          // await api.delete(`properties/delete/${id}`, { params: { forceDelete: true} });
          await api.delete(`properties/delete/${id}`, { params: { forceDelete: "true" } });
          break;
        
        case "City":
          await api.delete(`cities/delete/${id}?forceDelete=true`);
          break;

        default:
          throw new Error(`Unknown entity: ${entity}`);
      }
      console.log(`Deleting ${entity} with ID: ${id}`);
      console.log(`API URL:`, `/${entity.toLowerCase()}s/delete/${id}`);

      NotificationManager.removeAll();
      NotificationManager.success(`${entity} deleted successfully!`);
      return true;
    } else {
      NotificationManager.removeAll();
      NotificationManager.info(`${entity} deletion was cancelled.`);
      return false;
    }
    
  } catch (error) {
    console.error("Delete Error:", error.response?.data || error.message);
    if (
      entity === "Property" &&
      error.response?.status === 400 &&
      error.response?.data?.error === "Cannot delete property with active bookings"
    ) {
      await Swal.fire({
        title: "Cannot Delete Property",
        text: "This property has active bookings (Booked, Check_in, or Confirmed) and cannot be deleted.",
        icon: "error",
        confirmButtonColor: "#045D78",
      });
    } else if (
      entity === "User" &&
      error.response?.status === 403 &&
      error.response?.data?.error === "User cannot be deleted"
    ) {
      await Swal.fire({
        title: "Cannot Delete User",
        text: "This user has active bookings (Booked, Check_in, or Confirmed) and cannot be deleted.",
        icon: "error",
        confirmButtonColor: "#045D78",
      });
    } else if (
      entity === "User" &&
      error.response?.status === 403 &&
      error.response?.data?.error === "Cannot delete property"
    ) {
      await Swal.fire({
        title: "Cannot Delete User",
        text: "This user has properties with confirmed bookings and cannot be deleted.",
        icon: "error",
        confirmButtonColor: "#045D78",
      });
    } else {
      NotificationManager.error(`Failed to delete ${entity}. ${error.response?.data?.message || error.message}`);
    }
    return false;
  }
};