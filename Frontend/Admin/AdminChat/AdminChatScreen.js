import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUserMessage, sendUserMessage } from "../../api/api";

const { width } = Dimensions.get("window");

const AdminChatScreen = ({ route, navigation }) => {
  const { chatId, chatName } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    getMessages(chatId);
  }, [chatId]);

  const getMessages = async (id) => {
    try {
      setIsLoading(true);
      const result = await getUserMessage(id);
      setMessages(result.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      setIsSending(true);
      const chatObj = {
        chat_id: chatId,
        chat_name: chatName,
        message: message.trim(),
        sender: "admin",
        receiver: "user",
      };
      try {
        const result = await sendUserMessage(chatObj);
        if (result.data.success) {
          setMessage("");
          getMessages(chatId);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const EmptyStateMessage = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color="#BDBDBD" />
      <Text style={styles.emptyStateText}>No messages yet</Text>
      <Text style={styles.emptyStateSubText}>
        Start the conversation by sending a message
      </Text>
    </View>
  );

  const renderMessage = ({ item }) => {
    const isAdmin = item.sender === "admin";

    return (
      <View
        style={[
          styles.messageContainer,
          isAdmin ? styles.adminMessageContainer : styles.userMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isAdmin ? styles.adminBubble : styles.userBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isAdmin ? styles.adminMessageText : styles.userMessageText,
            ]}
          >
            {item.message}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isAdmin ? styles.adminTimestamp : styles.userTimestamp,
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Messages */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[
            styles.messagesList,
            messages.length === 0 && styles.emptyList,
          ]}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={EmptyStateMessage}
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
            editable={!isSending}
          />
          <TouchableOpacity
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isSending || message.trim().length === 0}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  messagesList: {
    padding: 15,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  messageContainer: {
    marginBottom: 15,
    flexDirection: "row",
  },
  userMessageContainer: {
    justifyContent: "flex-start",
  },
  adminMessageContainer: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userBubble: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  adminBubble: {
    backgroundColor: "#2196F3",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#000",
  },
  adminMessageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  userTimestamp: {
    color: "#999",
  },
  adminTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sendButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 22,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
});

export default AdminChatScreen;
