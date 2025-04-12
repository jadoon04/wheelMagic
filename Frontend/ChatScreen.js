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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserMessage, sendUserMessage } from "./api/api";
import { useFocusEffect } from "@react-navigation/native";

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);

  const flatListRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      getMessages();
    }, [])
  );
  const fetchData = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");

      if (!userString) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.navigate("Login");
        return;
      }

      const parsedUser = JSON.parse(userString);
      setUser({ ...parsedUser });
      await getMessages(parsedUser.uid);
    } catch (error) {
      console.error("Error retrieving user data:", error);
    } finally {
    }
  };

  const getMessages = async (id) => {
    try {
      const result = await getUserMessage(id);
      console.log(result.data.messages);
      setMessages(result.data.messages);
    } catch (error) {}
  };
  const handleSend = async () => {
    if (message.trim()) {
      console.log(user);
      const chat_obj = {
        chat_id: user.uid,
        chat_name: user.name,
        message: message,
        sender: "user",
        receiver: "admin",
        chat_name: user.name,
      };
      const result = await sendUserMessage(chat_obj);
      if (result.data.success) {
        setMessage("");
        getMessages(user.uid);
      }
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.agentMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.agentBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.agentMessageText,
            ]}
          >
            {item.message}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.timestamp,
                isUser ? styles.userTimestamp : styles.agentTimestamp,
              ]}
            >
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
            {isUser && (
              <Ionicons
                name={item.status === "read" ? "checkmark-done" : "checkmark"}
                size={16}
                color={item.status === "read" ? "#2196F3" : "#999"}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Help Center</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerSubtitle}>Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd()}
        onLayout={() => flatListRef.current.scrollToEnd()}
      />

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
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={16} color="#fff" />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerButton: {
    padding: 10,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerText: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
    flexDirection: "row",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  agentMessageContainer: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#2196F3",
  },
  agentBubble: {
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  agentMessageText: {
    color: "#000",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    marginRight: 5,
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  agentTimestamp: {
    color: "#999",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
  },
  attachButton: {
    padding: 10,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#2196F3",
    borderRadius: 20,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 10,
  },
});

export default ChatScreen;
