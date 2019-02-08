const Joi = require('joi');
const db = require('../models/index');
const io = require('../socket');

module.exports.getChats = async (req, res, next) => {
  db.User.findById(req.user._id).populate('chats.partner', ['fullName', 'profilePhoto.url', 'isOnline']).populate('chats.messages').exec()
    .then((user) => {
      res.send(user.chats);
    });
  // res.send(user.chats);
};

module.exports.getMessage = async (req, res, next) => {
  const user = await db.User.findById(req.user._id);
  const partner = await db.User.findById(req.params.id);
  if (!partner) return res.status(404).send('No partner found with this address');
  const messages = user.chats.filter(msg => partner.equals(msg.partner));
  res.send(messages);
};

module.exports.sendMessage = async (req, res, next) => {
  const messageFrom = await db.User.findById(req.user._id);
  const messageTo = await db.User.findById(req.body.partnerId);
  if (!messageTo) {
    return res.status(404).send('No Destination Endpoint Found to send message. 😟');
  }
  if (messageTo.equals(messageFrom)) {
    return res.status(400).send('You can\'t send message to you.');
  }
  const message = await db.Message.create({ text: req.body.text, author: messageFrom, });
  const receiverPreviousConversation = messageTo.chats.find(ele => ele.partner.equals(messageFrom._id));
  if (!receiverPreviousConversation) {
    const newMsg = {
      partner: messageFrom,
      messages: [message],
    };
    messageTo.chats.unshift(newMsg);
    messageTo.save();
  }
  else {
    receiverPreviousConversation.messages.push(message);
    messageTo.chats.splice(messageTo.chats.indexOf(receiverPreviousConversation), 1);
    messageTo.chats.unshift(receiverPreviousConversation);
    messageTo.save();
  }
  const senderPreviousConversation = messageFrom.chats.find(ele => ele.partner.equals(messageTo._id));
  if (!senderPreviousConversation) {
    const newMsg = {
      partner: messageTo,
      messages: [message],
    };
    messageFrom.chats.unshift(newMsg);
    messageFrom.save();
  }
  else {
    senderPreviousConversation.messages.push(message);
    messageFrom.chats.splice(messageFrom.chats.indexOf(senderPreviousConversation), 1);
    messageFrom.chats.unshift(senderPreviousConversation);
    messageFrom.save();
  }
  io.getIO().emit('onNewMessage', messageTo._id);
  res.status(200).send(message);
};
