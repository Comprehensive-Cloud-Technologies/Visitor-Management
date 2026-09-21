import axios from "axios";

const API_URL = "http://localhost:3060/api/visitors";

/* ==========================================
        CHECK IN VISITOR
========================================== */

export const checkInVisitor = async (

    visitorId,

    data

) => {

    const response = await axios.put(

        `${API_URL}/checkin/${visitorId}`,

        data

    );

    return response.data;

};

/* ==========================================
        GET VISITOR DETAILS
========================================== */

export const getVisitorForVerification = async (

    visitorId

) => {

    const response = await axios.get(

        `${API_URL}/${visitorId}`

    );

    return response.data;

};

/* ==========================================
        SEARCH VISITORS
========================================== */

export const searchVisitors = async (

    keyword

) => {

    const response = await axios.get(

        `${API_URL}/search/${keyword}`

    );

    return response.data;

};

/* ==========================================
        CURRENT VISITORS
========================================== */

export const getCurrentVisitors = async () => {

    const response = await axios.get(

        `${API_URL}/current`

    );

    return response.data;

};

/* ==========================================
        RECENT ACTIVITY
========================================== */

export const getRecentActivity = async () => {

    const response = await axios.get(

        `${API_URL}/recent-activity`

    );

    return response.data;

};

/* ==========================================
        DASHBOARD STATS
========================================== */

export const getDashboardStats = async () => {

    const response = await axios.get(

        `${API_URL}/dashboard-stats`

    );

    return response.data;

};