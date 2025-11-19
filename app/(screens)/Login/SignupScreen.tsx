import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Ionicons, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";

// Components
import Screen from "@/components/common/Screen";
import AppButton from "@/components/common/AppButton";

// apis
import apiClient from "@/app/apis/apiClient";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = yup.object().shape({
  email: yup.string().required().email().label("Email"),
  password: yup
    .string()
    .required()
    .min(8)
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one digit")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one symbol")
    .label("Password"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function SignupScreen() {
  const router = useRouter();
  const [eyeIcon, setEyeIcon] = useState<boolean>(false);
  const [eyeIconConfirm, setEyeIconConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (
    values: SignupFormValues,
    formikHelpers: FormikHelpers<SignupFormValues>
  ) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/api/auth/signup", {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.status === 200 || response.status === 201) {
        // Signup successful
        setLoading(false);
        router.push({
          pathname: "/(screens)/Login/OTPScreen",
          params: {
            email: values.email,
            type: "signup",
          },
        });
        Alert.alert(
          "Signup Success",
          response.data.message || "Sigup Success."
        );
      } else {
        // Some error from server
        setLoading(false);
        Alert.alert(
          "Signup Failed",
          response.data.error.email ||
            "Please check your details and try again."
        );
      }
    } catch (error: any) {
      setLoading(false);
      console.log("Signup error:", error.response || error.message);
      Alert.alert(
        "Signup Failed",
        error.response?.data?.error.email ||
          "Please check your details and try again."
      );
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.logocontainer}>
        <Image
          style={{ width: fontSize(66), height: fontSize(82) }}
          source={icons.logox}
        />
        <Text
          style={{
            color: Colors.blacky,
            fontFamily: FontFamily.semiBold,
            fontSize: fontSize(23),
            marginTop: RFPercentage(1.5),
          }}
        >
          Create your Account
        </Text>
      </View>

      <View style={{ marginTop: RFPercentage(4) }} />

      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        onSubmit={handleSignup}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          errors,
          setFieldTouched,
          touched,
          values,
        }) => (
          <>
            <View style={styles.inputmaincontainer}>
              {/* Email */}
              <View style={styles.emailmain}>
                <Ionicons
                  color={Colors.grey}
                  style={{ marginRight: RFPercentage(2) }}
                  size={RFPercentage(3)}
                  name={"mail"}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={() => setFieldTouched("email")}
                  autoCapitalize="none"
                  value={values.email}
                  placeholder="Email Address"
                  placeholderTextColor={Colors.grey}
                />
              </View>
              {touched.email && errors.email && (
                <View style={{ width: "90%" }}>
                  <Text style={styles.error}>{errors.email}</Text>
                </View>
              )}

              <View style={{ marginTop: RFPercentage(2) }} />

              {/* Password */}
              <View style={styles.emailmain}>
                <Fontisto
                  color={Colors.grey}
                  style={{ marginRight: RFPercentage(2) }}
                  size={RFPercentage(3)}
                  name={"locked"}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("password")}
                  onBlur={() => setFieldTouched("password")}
                  value={values.password}
                  placeholder="Password"
                  placeholderTextColor={Colors.grey}
                  secureTextEntry={!eyeIcon}
                />
                <TouchableOpacity
                  onPress={() => setEyeIcon(!eyeIcon)}
                  activeOpacity={0.7}
                  style={styles.eyeicon}
                >
                  <MaterialCommunityIcons
                    color={Colors.lightBlack}
                    style={{ right: RFPercentage(1) }}
                    size={RFPercentage(3)}
                    name={eyeIcon ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <View style={{ width: "90%" }}>
                  <Text style={styles.error}>{errors.password}</Text>
                </View>
              )}

              <View style={{ marginTop: RFPercentage(2) }} />

              {/* Confirm Password */}
              <View style={styles.emailmain}>
                <Fontisto
                  color={Colors.grey}
                  style={{ marginRight: RFPercentage(2) }}
                  size={RFPercentage(3)}
                  name={"locked"}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={() => setFieldTouched("confirmPassword")}
                  value={values.confirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor={Colors.grey}
                  secureTextEntry={!eyeIconConfirm}
                />
                <TouchableOpacity
                  onPress={() => setEyeIconConfirm(!eyeIconConfirm)}
                  activeOpacity={0.7}
                  style={styles.eyeicon}
                >
                  <MaterialCommunityIcons
                    color={Colors.lightBlack}
                    style={{ right: RFPercentage(1) }}
                    size={RFPercentage(3)}
                    name={eyeIconConfirm ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <View style={{ width: "90%" }}>
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.loginbutton}
              activeOpacity={0.7}
            >
              <AppButton
                title={"Continue"}
                buttonColor={Colors.blue}
                loading={loading}
              />
            </TouchableOpacity>
          </>
        )}
      </Formik>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          flex: 1,
          marginBottom: RFPercentage(3),
        }}
      >
        <Text
          style={{
            color: Colors.lightBlack,
            fontFamily: FontFamily.regular,
            fontSize: RFPercentage(1.5),
          }}
        >
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text
            style={{
              color: Colors.blue,
              fontFamily: FontFamily.semiBold,
              fontSize: RFPercentage(1.5),
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  logocontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(5),
  },
  logo: {
    width: RFPercentage(15),
    height: RFPercentage(15),
  },
  inputmaincontainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: RFPercentage(1),
  },
  eyeicon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: RFPercentage(1),
    width: RFPercentage(5),
    height: RFPercentage(5),
  },
  emailmain: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: RFPercentage(7),
    borderBottomWidth: RFPercentage(0.2),
    borderBottomColor: Colors.blue,
    color: Colors.blacky,
    paddingLeft: RFPercentage(1.5),
    borderRadius: RFPercentage(1),
  },
  input: {
    width: "80%",
    fontFamily: FontFamily.regular,
    color: Colors.lightBlack,
    fontSize: RFPercentage(2),
  },
  error: {
    color: "#FF0000",
    fontSize: RFPercentage(1.3),
    marginTop: RFPercentage(0.5),
    fontFamily: FontFamily.regular,
  },
  loginbutton: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFPercentage(5),
  },
});
