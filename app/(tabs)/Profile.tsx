import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Components
import CommonModal from "@/components/common/CommonModal";

// API
import apiClient, { BASE_URL } from "@/app/apis/apiClient";

// redux
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/redux/store";
import { clearTokensAsync } from "@/app/redux/features/authSlice";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

// Components
import ProfileList from "@/components/Specific/ProfileList";

// Type for navigation
type RootStackParamList = {
  EditAccount: undefined;
  TicketsScreen: undefined;
  RewardScreen: undefined;
  ChangePassword: undefined;
  SupportScreen: undefined;
  TermsConditionScreen: undefined;
  LoginScreen: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const Profile: React.FC<ProfileScreenProps> = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState<string>("");

  const [image, setImage] = useState<string | null>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get("/api/user/me");
        const user = response.data.data;

        setName(user.fullName || "");

        setImage(user.profilePic ? `${BASE_URL}${user.profilePic}` : null);
        console.log("data response", response.data);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  // Correct logout handler
  const handleLogout = async () => {
    try {
      await dispatch(clearTokensAsync()).unwrap(); // clears Redux & AsyncStorage
      router.replace("/(screens)/Login/LoginScreen"); // navigate to login
    } catch (err) {
      console.log("Logout failed:", err);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer}>
        <View style={styles.profileWrapper}>
          <View>
            <Image
              style={styles.profileImage}
              source={image ? { uri: image } : icons.emptyP}
            />
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: RFPercentage(4) }} />

      <ProfileList
        icon={icons.personal}
        title="Personal Details"
        onpress={() => router.push("/(screens)/Profile/EditPersonalDetails")}
      />
      <ProfileList
        icon={icons.item}
        title="My Items"
        onpress={() => router.push("/(screens)/Profile/MyItems")}
      />
      <ProfileList
        icon={icons.favorite}
        title="Favorite"
        onpress={() => router.push("/(screens)/Profile/FavoriteScreen")}
      />

      <ProfileList
        icon={icons.lock}
        title="Change Password "
        onpress={() => router.push("/(screens)/Profile/ChangePassword")}
      />
      <ProfileList
        icon={icons.language}
        title="Languages"
        onpress={() => router.push("/(screens)/Profile/Languages")}
      />

      <ProfileList
        icon={icons.help}
        title="Help & Support"
        onpress={() => router.push("/(screens)/Profile/SupportScreen")}
      />
      <ProfileList
        icon={icons.term}
        title="Terms & Conditions"
        onpress={() => router.push("/(screens)/Profile/TermsCondition")}
      />

      <View
        style={{
          width: "80%",
          marginTop: RFPercentage(1),
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsModalVisible(true)}
          style={styles.logoutContainer}
        >
          <MaterialIcons name="logout" size={26} color={Colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* modal */}
      <CommonModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        image={icons.logout}
        title={"Logout"}
        subtitle={
          "Are you sure you want to log out? You’ll need to log back in to manage your properties and visits."
        }
        buttonpri={"Confirm"}
        buttonsec={"Cancel"}
        onpressPri={handleLogout}
        onpressSec={() => {
          setIsModalVisible(false);
        }}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  headerContainer: {
    width: "100%",
    height: Platform.OS === "ios" ? RFPercentage(26) : RFPercentage(30),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blue,
    borderBottomLeftRadius: RFPercentage(3),
    borderBottomRightRadius: RFPercentage(3),
  },
  profileWrapper: {
    width: "90%",
    alignItems: "center",
    position: "absolute",
    bottom: RFPercentage(3),
  },
  profileImage: {
    width: fontSize(80),
    height: fontSize(80),
    borderRadius: fontSize(40),
  },
  name: {
    marginTop: RFPercentage(1),
    color: Colors.white,
    fontFamily: FontFamily.medium,
    fontSize: fontSize(14),
    marginLeft: RFPercentage(1),
  },
  points: {
    color: Colors.white,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(1.4),
    marginVertical: RFPercentage(0.5),
  },
  level: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1),
  },
  logoutContainer: {
    width: "40%",
    padding: RFPercentage(0.8),
    backgroundColor: Colors.blue,
    borderRadius: RFPercentage(0.5),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  logoutText: {
    marginLeft: RFPercentage(1),
    color: Colors.white,
    fontFamily: FontFamily.medium,
    fontSize: RFPercentage(1.8),
  },
  iconCircle: {
    width: RFPercentage(4),
    height: RFPercentage(4),
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFPercentage(3),
    position: "absolute",
    left: 0,
  },
});
