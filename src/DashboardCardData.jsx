import axios from 'axios';

const fetchData=async()=>{
    const BASE_URL='base url';
    try {
        const response=await Promise.all([
            axios.get(`${BASE_URL}/country`),
            axios.get(`${BASE_URL}/category`),
            axios.get(`${BASE_URL}/cuppon`),
            axios.get(`${BASE_URL}/totalPayment`),
            axios.get(`${BASE_URL}/enquiry`),
            axios.get(`${BASE_URL}/property`),
            axios.get(`${BASE_URL}/extraImages`),
            axios.get(`${BASE_URL}/facility`),
            axios.get(`${BASE_URL}/gallery`),
            axios.get(`${BASE_URL}/totalGallery`),
            axios.get(`${BASE_URL}/waitingBook`),
            axios.get(`${BASE_URL}/confirmedBook`),
            axios.get(`${BASE_URL}/checkInBook`),
            axios.get(`${BASE_URL}/totalPage`),
            axios.get(`${BASE_URL}/faq`),
            axios.get(`${BASE_URL}/totalUsers`),
            axios.get(`${BASE_URL}/totalBookedEarning`),
        ])

        return{
            country:response[0].data.country,  
            category:response[1].data.category,  
            cuppon:response[2].data.cuppon,  
            totalPayment:response[3].data.totalPayment,  
            enquiry:response[4].data.enquiry,  
            property:response[5].data.property,  
            extraImages:response[6].data.extraImages,  
            facility:response[7].data.facility,  
            gallery:response[8].data.gallery,  
            totalGallery:response[9].data.totalGallery,  
            waitingBook:response[10].data.waitingBook,  
            confirmedBook:response[11].data.confirmedBook,  
            checkInBook:response[12].data.checkInBook,  
            totalPage:response[13].data.totalPage,  
            faq:response[14].data.faq,  
            totalUsers:response[15].data.totalUsers,  
            totalBookedEarning:response[16].data.totalBookedEarning,  
        }
    } catch (error) {
        console.error("Error fetching count data:", error);
        return null;
    }
}
export default  fetchData;