import axios from "axios";

const API =
"/api/notifications";

export const getNotifications =
() => {

  return axios.get(API);

};
export const markAllNotificationsRead =
() => {
    return axios.put(
    `${API}/mark-all-read`
  ); 
};  