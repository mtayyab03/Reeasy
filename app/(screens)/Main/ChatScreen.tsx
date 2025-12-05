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
import { useLocalSearchParams, useRouter } from "expo-router";
import { format } from "date-fns";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// components
import Screen from "@/components/common/Screen";
import AppHeader from "@/components/common/AppHeader";

// redux
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

// firebase
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebaseConfig"; // ✅ your firebase file

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const ChatScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [name, setName] = useState<string>("");
  const [senderUid, setSenderUid] = useState<string>("");
  const [image, setImage] = useState<string | null>("");

  useEffect(() => {
    const fetchSenderUser = async () => {
      try {
        const response = await apiClient.get("/api/user/me");
        const user = response.data.data;

        setName(user.fullName || "");
        setImage(user.profilePic ? `${BASE_URL}${user.profilePic}` : null);
        setSenderUid(user.uuid);
        console.log("data response", response.data);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };

    fetchSenderUser();
  }, []);

  const ownerName =
    typeof params.ownerName === "string"
      ? params.ownerName
      : params.ownerName?.[0] || "";

  const ownerImage =
    typeof params.ownerImage === "string"
      ? params.ownerImage
      : params.ownerImage?.[0] || "";

  const ownerUid =
    typeof params.ownerUid === "string"
      ? params.ownerUid
      : params.ownerUid?.[0] || "";
  console.log("Chat User Name:", ownerName);
  console.log("Chat User Image:", ownerImage);
  console.log("Chat User UID:", ownerUid);

  const [messages, setMessages] = useState<any[]>([]);

  const chatId =
    senderUid && ownerUid
      ? senderUid < ownerUid
        ? `${senderUid}_${ownerUid}`
        : `${ownerUid}_${senderUid}`
      : "";

  console.log("chat id taken from current user token", chatId);

  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const chatRef = doc(db, "chats", chatId);

      await setDoc(
        chatRef,
        {
          users: [senderUid, ownerUid],

          senderUid: senderUid,
          senderName: name,
          senderImage: image,

          receiverUid: ownerUid,
          receiverName: ownerName,
          receiverImage: ownerImage,

          lastMessage: input,
          lastMessageTime: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: input,
        senderId: senderUid,
        senderName: name,
        senderImage: image,
        createdAt: serverTimestamp(),
      });

      setInput("");
    } catch (error) {
      console.log("Send Message Error:", error);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];

      snapshot.forEach((doc) => {
        msgs.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setMessages(msgs.reverse());
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleBack = () => {
    router.back();
  };
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  return (
    <Screen style={styles.screen}>
      <AppHeader title={ownerName} onPress={() => handleBack()} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          renderItem={({ item }) => {
            // ✅ ADD THIS LINE HERE
            const isMe = item.senderId === senderUid;

            return (
              <View
                style={[
                  styles.messageRow,
                  {
                    justifyContent: isMe ? "flex-end" : "flex-start",
                  },
                ]}
              >
                {/* ✅ RECEIVER IMAGE (LEFT SIDE) */}
                {!isMe && (
                  <Image
                    source={ownerImage ? { uri: ownerImage } : icons.emptyP}
                    style={styles.avatar}
                  />
                )}

                {/* ✅ MESSAGE BUBBLE */}
                <View style={[styles.bubble, isMe ? styles.me : styles.other]}>
                  <Text
                    style={{
                      color: isMe ? "#fff" : "#000",
                      fontSize: 16,
                    }}
                  >
                    {item.text}
                  </Text>

                  {/* ✅ TIMESTAMP */}
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#ddd",
                      marginTop: 4,
                      alignSelf: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    {item.createdAt?.toDate
                      ? format(item.createdAt.toDate(), "hh:mm a")
                      : ""}
                  </Text>
                </View>

                {/* ✅ SENDER IMAGE (RIGHT SIDE) */}
                {isMe && (
                  <Image
                    source={image ? { uri: image } : icons.emptyP}
                    style={styles.avatar}
                  />
                )}
              </View>
            );
          }}
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
