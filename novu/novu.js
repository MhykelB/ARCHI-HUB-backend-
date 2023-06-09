const Novu = require("@novu/node").Novu;
require("dotenv").config();

const novu = new Novu(process.env.NOVU_API_KEY);

const createTopic = async (topicKey, topicName) => {
  return await novu.topics.create({
    key: topicKey,
    name: topicName,
  });
};

// will require userid,
const addSubscribersToTopic = async (topicKey, ID) => {
  return novu.topics.addSubscribers(topicKey, {
    subscribers: [ID],
  });
};
const unSubscriberToTopic = async (topicKey, ID) => {
  return novu.topics.removeSubscribers(topicKey, {
    subscribers: [ID],
  });
};
// will require userid, firstname, lastname, email and maybe telephone
const createNewSubscriber = async (userObj) => {
  await novu.subscribers.identify(userObj._id, {
    email: userObj.email,
    firstName: userObj.firstName,
    lastName: userObj.lastName,
  });
};
const updateSubcriber = async (userObj) => {
  const result = await novu.subscribers.update(userObj.id, {
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    data: { interest: userObj.interests },
  });
  return result;
};

// will require notification triggerer name and id, exempt him/her from receiving a notification by passing in action
const sendNotificationToMany = async (triggerKey, topicKey, mailer) => {
  const result = await novu.trigger(triggerKey, {
    to: [{ type: "Topic", topicKey: topicKey }],
    payload: {
      sender: mailer.sender,
    },
  });
  return result;
};
const sendReactionNotification = async (triggerKey, topicKey, reactor) => {
  const result = await novu.trigger(triggerKey, {
    to: [{ type: "Topic", topicKey: topicKey }],
    payload: {
      reactor: reactor,
    },
  });
  return result;
};
const sendNotificationToOne = async (triggerKey, mailer) => {
  const result = await novu.trigger(triggerKey, {
    to: mailer.id,
    payload: {
      sender: mailer.userName,
    },
  });
  return result;
};
const completeSignUpNotice = async (triggerKey, userInfo) => {
  const result = await novu.trigger(triggerKey, {
    to: userInfo.id,
    payload: {
      link: userInfo.link,
    },
  });
  return result;
};
const sendResetToken = async (triggerKey, details) => {
  const result = await novu.trigger(triggerKey, {
    to: details.id,
    payload: {
      name: details.name,
      link: details.link,
    },
  });
  return result;
};

module.exports = {
  createNewSubscriber,
  addSubscribersToTopic,
  createTopic,
  sendNotificationToMany,
  sendNotificationToOne,
  unSubscriberToTopic,
  sendResetToken,
  completeSignUpNotice,
  updateSubcriber,
  sendReactionNotification,
};
