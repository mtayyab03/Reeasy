import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";

// components
import Screen from "@/components/common/Screen";
import AppHeader from "@/components/common/AppHeader";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const ChatScreen = () => {
  const router = useRouter();
  const { name, time } = useLocalSearchParams<{ name: string; time: string }>();
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey, how are you?", sender: "other" }, // dummy initial msg
  ]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (input.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleBack = () => {
    router.back();
  };

  return (
    <Screen style={styles.screen}>
      <AppHeader title={name} onPress={() => handleBack()} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                {
                  justifyContent:
                    item.sender === "me" ? "flex-end" : "flex-start",
                },
              ]}
            >
              {item.sender === "other" && (
                <Image source={icons.profile} style={styles.avatar} />
              )}

              <View
                style={[
                  styles.bubble,
                  item.sender === "me" ? styles.me : styles.other,
                ]}
              >
                <Text
                  style={{
                    color: item.sender === "me" ? "#fff" : "#000",
                    fontSize: 16,
                  }}
                >
                  {item.text}
                </Text>
              </View>

              {item.sender === "me" && (
                <Image source={icons.profile} style={styles.avatar} />
              )}
            </View>
          )}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1, width: "100%", marginTop: RFPercentage(2) }}
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <View
            style={{
              width: "80%",
              backgroundColor: Colors.pureWhite,
              borderRadius: RFPercentage(1),
              paddingHorizontal: 15,
              paddingVertical: 7,
              borderWidth: RFPercentage(0.1),
              borderColor: Colors.stroke,
            }}
          >
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#aaa"
              style={styles.input}
              value={input}
              onChangeText={setInput}
              multiline
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Image source={icons.send} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.white,
  },
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 15,
  },
  me: {
    backgroundColor: Colors.blue, // your theme color
    borderBottomRightRadius: 0,
  },
  other: {
    backgroundColor: "#eee",
    borderBottomLeftRadius: 0,
  },
  inputBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: RFPercentage(1),
    backgroundColor: Colors.white,
    marginBottom: RFPercentage(1),
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 10,
    color: Colors.lightBlack,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  sendIcon: {
    width: 22,
    height: 22,
    tintColor: "#fff",
    resizeMode: "contain",
  },
});
