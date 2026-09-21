import pool from "../config/db.js";
import { getIO } from "../socket.js";
export const getNotifications =
async (req,res) => {

  try {

    const [notifications] =
      await pool.execute(
        `
        SELECT *
        FROM notifications
        ORDER BY id DESC
        `
      );

    res.json({
      success:true,
      notifications
    });

  }
  catch(error){

    console.log(error);

    res.status(500).json({
      success:false
    });

  }

};

export const markAllNotificationsRead =
async (req,res) => {

  try {

    await pool.execute(
      `
      UPDATE notifications
      SET is_read = 1
      WHERE is_read = 0
      `
    );

    res.json({
      success:true,
      message:"Notifications marked as read"
    });

  }
  catch(error){

    console.log(error);

    res.status(500).json({
      success:false
    });

  }

};
export const addNotification =
async (
  title,
  message,
  visitor_id = null
) => {

  try {

    const [result] =
      await pool.execute(

        `
        INSERT INTO notifications
        (
          title,
          message,
          visitor_id
        )
        VALUES
        (?,?,?)
        `,

        [
          title,
          message,
          visitor_id
        ]

      );

    const io = getIO();
    if (io) {
      io.emit("newNotification", {
        id: result.insertId,
        title,
        message,
        visitor_id,
        type: "visitor",
        user_id: null,
        is_read: 0,
        created_at: new Date()
      });
    }
  }

  catch(error){

    console.log(error);

  }

};