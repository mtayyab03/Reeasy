import React, { useState } from "react";
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
import { Feather, Ionicons } from "@expo/vector-icons";
// Components
import Screen from "@/components/common/Screen";
import AppLine from "@/components/common/AppLine";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

type MsgData = {
  id: string;
  name: string;
  time: string;
  lastmsg: string;
  profileImage: string;
};

const ChatPerson: MsgData[] = [
  {
    id: "1",
    name: "John Doe",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    time: "21:30",
    lastmsg: "I thought it was you, lol",
  },
  {
    id: "4",
    name: "Jone Snow",
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    time: "09:22",
    lastmsg: "Just sent the design, feel thi...",
  },
  {
    id: "5",
    name: "Allen Virk",
    profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
    time: "05:20",
    lastmsg: "Whats up Sam, it’s Frankie.",
  },
  {
    id: "6",
    name: "Lemo Roge",
    profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
    time: "11:30",
    lastmsg: "Sam, are you kidding?!",
  },
];

const Chat = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredChatPersons = ChatPerson.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
        {filteredChatPersons.length > 0 ? (
          filteredChatPersons.map((item) => (
            <TouchableOpacity
              style={{ width: "100%" }}
              key={item.id}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/(screens)/Main/ChatScreen",
                  params: {
                    name: item.name,
                    time: item.time,
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
                  source={{ uri: item.profileImage }}
                  style={styles.profileImage}
                />

                {/* Name + Last message */}
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.details}>{item.lastmsg}</Text>
                </View>

                {/* Time */}
                <Text style={styles.time}>{item.time}</Text>
              </View>

              {/* Divider line after each item */}
              <AppLine />
            </TouchableOpacity>
          ))
        ) : (
          // Empty state (no messages)
          <View
            style={{
              flex: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="mail-outline" size={50} color={Colors.lightGrey} />
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                fontFamily: FontFamily.medium,
                color: Colors.lightGrey,
              }}
            >
              No message
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
