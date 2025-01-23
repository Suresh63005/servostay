import axios from "axios";
import { NotificationManager } from "react-notifications";

const BASE_URL = "http://localhost:5000";

export const searchEntity = async (entity, query, setResults) => {
  try {
    // Construct the search URL based on the entity
    let url = '';
    switch (entity) {
      case "Country":
        url = `${BASE_URL}/countries/search?query=${query}`;
        break;
      case "Category":
        url = `${BASE_URL}/categories/search?query=${query}`;
        break;
      case "Coupon":
        url = `${BASE_URL}/coupons/search?query=${query}`;
        break;

        case "Facility":
          url = `${BASE_URL}/facilities/all?search=${query}`;
          break;
      
      // Add more cases for other entities
      default:
        throw new Error("Unknown entity type");
    }

    // Send the GET request to search for the entity
    const response = await axios.get(url, { withCredentials: true });

    // Set the search results to the state (e.g., for displaying them)
    setResults(response.data);

    // Optional: Show a success notification (if needed)
    NotificationManager.success(`${entity} search completed successfully!`);

  } catch (error) {
    // Handle any errors
    console.error("Search Error:", error);
    NotificationManager.error(`Failed to search ${entity}. Please try again.`);
  }
};
