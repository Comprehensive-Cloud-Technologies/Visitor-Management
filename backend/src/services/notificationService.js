import axios from "axios";

const API =
"http://localhost:3060/api/notifications";

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