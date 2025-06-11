// controllers/chatController.js
import Chat from "../models/Chat.js";

export const getOrCreateChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.body.otherUserId;

    if (!otherUserId) return res.status(400).json({ error: "otherUserId es requerido" });

    let chat = await Chat.findOne({
      participants: { $all: [userId, otherUserId] }
    }).populate("participants", "username");

    if (!chat) {
      chat = new Chat({
        participants: [userId, otherUserId],
        messages: []
      });
      await chat.save();
      chat = await chat.populate("participants", "username");
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
