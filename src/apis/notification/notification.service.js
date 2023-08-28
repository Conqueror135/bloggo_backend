import { Server } from "socket.io";
import NOTIFICATION from "./notification.model";
import { ObjectId } from "mongodb";
import { NOTIFICATION_EVENT } from "./notification.event";
import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from "./notification.constants";

export function getAll(query) {
  const apiResponse = NOTIFICATION.find(query).lean();
  return apiResponse;
}

export function getAllByUserId(userId) {
  const apiResponse = NOTIFICATION.find({
    recipient: ObjectId(userId),
    is_deleted: false,
  })
    .sort("-created_at")
    .lean();
  return apiResponse;
}
let io;
const socketIdStorage = {};

let allNotification;
let allRemind;
let unReadNotification;
let unReadRemind;

function emitEventToUser(recipient, event, payload) {
  socketIdStorage[recipient]?.forEach((socketId) => {
    console.log("socketId ", socketId);
    io.sockets.sockets.get(socketId)?.emit(event, payload);
  });
}

async function getCurrentNumberNotifications(recipient) {
  allNotification = await getAllByUserId(recipient);
  unReadNotification = allNotification.filter((notification) => notification.status !== NOTIFICATION_STATUS.VIEWED);

  return {
    // total: allNotification?.length,
    totalNotice: allNotification?.length,
    totalRemind: allRemind?.length,
    // unread: unReadNotification?.length,
    unreadNotice: unReadNotification?.length,
    unreadRemind: unReadRemind?.length,
  };
}

export function initNotificationService(server) {
  io = new Server(server, {
    transports: ["websocket"],
    path: "/socket",
  });
  io.on("connection", (socket) => {
    console.log("a socket connected", socket.id);
    socket.on("disconnect", createHandler(socket, unregisterUserDevice));
    socket.on("user_login_id", createHandler(socket, registerUserDevice));
    //   socket.on('user_received_notification', createHandler(socket, receivedAllNotification));
    socket.on("user_viewed_all_notifications", createHandler(socket, viewedAllNotification));
    socket.on("user_viewed_one_notification", createHandler(socket, viewedOneNotification));
  });
  // io.listen(3001);
}
function createHandler(socket, registerUserDevice) {
  return (payload) => {
    return registerUserDevice(socket, payload);
  };
}
async function viewedAllNotification(socket, { recipient }) {
  console.log("Recipient ", recipient);
  try {
    await NOTIFICATION.updateMany({ recipient: recipient }, { status: NOTIFICATION_STATUS.VIEWED });
    await informAllNotificationsUpdatedToAllDevices(recipient);
  } catch (e) {
    console.log(e);
  }
}
async function informAllNotificationsUpdatedToAllDevices(recipient) {
  await informNotificationCountToAllDevices(recipient);
  emitEventToUser(recipient, NOTIFICATION_EVENT.NOTIFICATION_UPDATED_ALL);
}

async function registerUserDevice(socket, { recipient }) {
  socket.recipient = recipient;
  if (socketIdStorage[recipient]) {
    socketIdStorage[recipient] = [socket.id, ...socketIdStorage[recipient]];
  } else {
    socketIdStorage[recipient] = [socket.id];
  }
  await informNotificationCountToOneDevice(socket, recipient);
}

async function viewedOneNotification(socket, { recipient, _id }) {
  try {
    let notificationViewed;
    notificationViewed = await NOTIFICATION.findByIdAndUpdate(
      _id,
      { status: NOTIFICATION_STATUS.VIEWED },
      { new: true, useFindAndModify: false },
    )
      .populate([
        { path: "feedback", select: "title" },
        { path: "sender", select: "username" },
      ])
      .lean();

    await informOneNotificationsUpdatedToAllDevices(recipient, notificationViewed);
  } catch (e) {
    console.log(e);
  }
}
async function informOneNotificationsUpdatedToAllDevices(recipient, notificationUpdated) {
  await informNotificationCountToAllDevices(recipient);
  emitEventToUser(recipient, NOTIFICATION_EVENT.NOTIFICATION_UPDATED_ONE, notificationUpdated);
}

export function unregisterUserDevice(socket) {
  console.log("a socket disconnected");
  const recipient = socket.recipient;
  const socketId = socket.id;
  if (socketIdStorage.hasOwnProperty(socket.recipient)) {
    let arrSocketIO = socketIdStorage[recipient];
    let idx = arrSocketIO.indexOf(socketId);
    if (idx !== -1) {
      arrSocketIO.splice(idx, 1);
    }
    if (arrSocketIO.length === 0) {
      delete socketIdStorage[recipient];
    } else {
      socketIdStorage[recipient] = arrSocketIO;
    }
  }
}
async function informNotificationCountToAllDevices(recipient) {
  try {
    emitEventToUser(recipient, NOTIFICATION_EVENT.NOTIFICATION_COUNT, await getCurrentNumberNotifications(recipient));
  } catch (e) {
    console.log(e);
  }
}
async function informNotificationCountToOneDevice(socket, recipient) {
  try {
    const notificationCount = await getCurrentNumberNotifications(recipient);
    socket.emit(NOTIFICATION_EVENT.NOTIFICATION_COUNT, notificationCount);
  } catch (e) {
    console.log(e);
  }
}
export function pushNotification(notifications) {
  notifications.forEach((notification) => {
    const jsoNotification = JSON.parse(JSON.stringify(notification));
    informNotificationCountToAllDevices(jsoNotification.recipient);
    emitEventToUser(jsoNotification.recipient, NOTIFICATION_EVENT.NOTIFICATION_NEW, jsoNotification);
  });
}
export async function notification(payload) {
  try {
    if (payload.recipients) {
      const newNotificationData = payload.recipients.map((userId) => {
        return {
          sender: payload.sender,
          recipient: userId,
          status: NOTIFICATION_STATUS.SENT,
          feedback: payload.feedback,
          response: payload.response,
          link_to: payload.link_to,
          type: payload.type,
        };
      });
      const newNotifications = await NOTIFICATION.create(newNotificationData);
      pushNotification(newNotifications);
    }
  } catch (e) {
    console.log("e", e);
  }
}
