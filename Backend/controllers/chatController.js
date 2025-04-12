import Chat from "../model/MessagesSchema.js";

export const sendMessageController = async (req, res) => {
  try {
    const { chat_id, sender, receiver, message, chat_name } = req.body;
    console.log(req.body);
    if (!chat_id || !sender || !receiver || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the chat or create a new one
    let chat = await Chat.findOne({ chat_id });
    if (!chat) {
      chat = new Chat({ chat_id, messages: [], chat_name });
    }

    // Add the message to the chat
    chat.messages.push({
      sender,
      receiver,
      message,
    });

    // Update the last updated timestamp
    chat.lastUpdated = Date.now();

    await chat.save();

    return res.status(200).json({
      message: "Message sent successfully",
      chat,
      success: true,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllChatsController = async (req, res) => {
  try {
    const chats = await Chat.find({})
      .sort({ lastUpdated: -1 })
      .select("chat_id chat_name lastUpdated messages")
      .lean();

    const chatSummaries = chats.map((chat) => {
      console.log(chat);
      const lastMessage = chat.messages[chat.messages.length - 1];
      return {
        chat_id: chat.chat_id,
        name: chat.chat_name,
        lastUpdated: chat.lastUpdated,
        lastMessage: lastMessage ? lastMessage.message : "No messages yet",
      };
    });

    return res.status(200).json({
      message: "All chats retrieved successfully",
      chats: chatSummaries,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const getSpecificChatController = async (req, res) => {
  try {
    const { id: chat_id } = req.params;
    console.log(chat_id);
    if (!chat_id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const chat = await Chat.findOne({ chat_id }).lean();

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    // Sort messages by timestamp
    chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return res.status(200).json({
      message: "Chat retrieved successfully",
      messages: chat.messages,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
