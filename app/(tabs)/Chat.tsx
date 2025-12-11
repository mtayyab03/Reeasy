import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

// Components
import Screen from "@/components/common/Screen";
import AppLine from "@/components/common/AppLine";
// firebase
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { db } from "@/firebaseConfig";
import apiClient from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

const Chat = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatList, setChatList] = useState<any[]>([]);
  const [senderUid, setSenderUid] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSenderUser = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/user/me");
        setSenderUid(res.data.data.uuid);
      } catch (err) {
        console.log("User fetch error", err);
      }
    };

    fetchSenderUser();
  }, []);

  useEffect(() => {
    if (!senderUid) return;
    setLoading(true);
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", senderUid),
      orderBy("lastMessageTime", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats: any[] = [];

      snapshot.forEach((doc) => {
        chats.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setChatList(chats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [senderUid]);

  const filteredChatPersons = chatList.filter((chat) => {
    const otherUserName =
      chat.senderUid === senderUid ? chat.receiverName : chat.senderName;

    return otherUserName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Screen style={styles.screen}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        {/* Search Icon */}
        <Ionicons
          name="search"
          size={20}
          color={Colors.lightGrey}
          style={{ marginHorizontal: 8 }}
        />

        {/* Input */}
        <TextInput
          placeholder="Search by name"
          style={styles.searchInput}
          placeholderTextColor={Colors.lightGrey}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)} // controlled input
        />
      </View>
      <View style={{ width: "100%", marginVertical: RFPercentage(1) }}>
        <AppLine />
      </View>

      <View style={{ width: "90%", alignItems: "center" }}>
        {loading ? (
          <Text
            style={{
              marginTop: 50,
              color: Colors.darkGrey,
              fontSize: fontSize(14),
              fontFamily: FontFamily.medium,
            }}
          >
            Loading chats...
          </Text>
        ) : filteredChatPersons.length > 0 ? (
          filteredChatPersons.map((item) => {
            const isMe = item.senderUid === senderUid;

            const displayName = isMe ? item.receiverName : item.senderName;
            const displayImage = isMe ? item.receiverImage : item.senderImage;
            const displayUid = isMe ? item.receiverUid : item.senderUid;

            return (
              <TouchableOpacity
                style={{ width: "100%" }}
                key={item.id}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/(screens)/Main/ChatScreen",
                    params: {
                      ownerName: displayName,
                      ownerImage: displayImage,
                      ownerUid: displayUid,
                    },
                  })
                }
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: RFPercentage(1),
                  }}
                >
                  {/* Profile Image */}
                  <Image
                    source={displayImage ? { uri: displayImage } : icons.emptyP}
                    style={styles.profileImage}
                  />

                  {/* Name + Last message */}
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.details}>{item.lastMessage}</Text>
                  </View>

                  {/* Time */}
                  <Text style={styles.time}>
                    {item.lastMessageTime?.toDate
                      ? format(item.lastMessageTime.toDate(), "hh:mm a")
                      : ""}
                  </Text>
                </View>

                <AppLine />
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Ionicons name="mail-outline" size={50} color={Colors.lightGrey} />
            <Text style={{ marginTop: 10, color: Colors.lightGrey }}>
              No conversations yet
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default Chat;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  searchContainer: {
    width: "90%",
    backgroundColor: Colors.pureWhite,
    borderRadius: RFPercentage(1),
    paddingHorizontal: 15,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    marginTop: RFPercentage(1),
  },

  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.lightBlack,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    color: Colors.lightBlack,
  },
  details: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: "#555",
  },
  time: {
    fontSize: 12,
    fontFamily: FontFamily.semiBold,
    color: Colors.lightBlack,
  },
});
