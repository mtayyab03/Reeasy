import React, { useState, useEffect } from "react";
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

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";

import {
  login,
  selectAuthStatus,
  selectAuthError,
} from "@/app/redux/features/authSlice";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string, params?: object) => void;
  };
}

export default function LoginScreen(props: LoginScreenProps) {
  const router = useRouter();
  const [eyeIcon, setEyeIcon] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  // Validation schema for email and password
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
  });

  const handleLogin = async (
    values: LoginFormValues,
    formikHelpers: FormikHelpers<LoginFormValues>
  ) => {
    setLoading(true);
    try {
      console.log("🔹 Attempting login with:", values);

      const resultAction = await dispatch(
        login({ email: values.email, password: values.password })
      );

      console.log("🔹 Result Action:", resultAction);

      if (login.fulfilled.match(resultAction)) {
        console.log("✅ Login successful!");
        console.log("🔹 AccessToken:", resultAction.payload.accessToken);
        console.log("🔹 RefreshToken:", resultAction.payload.refreshToken);

        router.replace("/(tabs)/Home");
      } else if (login.rejected.match(resultAction)) {
        const payload = resultAction.payload;

        if (payload?.status === 403) {
          Alert.alert("Login Failed", "Please verify your email first.");
          router.push({
            pathname: "/(screens)/Login/OTPScreen",
            params: {
              email: values.email,
              type: "login",
            },
          });
          return;
        }

        Alert.alert("Login Failed", payload?.message || "Invalid credentials");
      } else {
        console.warn("⚠️ Login returned unexpected action:", resultAction);
        Alert.alert("Login Failed", "Unexpected login result");
      }
    } catch (error: any) {
      console.error("❌ Login exception:", error);
      Alert.alert(
        "Login Failed",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.logocontainer}>
        <Image
          style={{ width: fontSize(100), height: fontSize(120) }}
          source={icons.logo}
        />
      </View>

      {/* login text */}
      <View style={{ marginTop: RFPercentage(5) }} />

      {/* //email input */}
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleLogin}
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
                  onChangeText={(text) =>
                    handleChange("email")(text.toLowerCase())
                  }
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

              {/* forget password */}
              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.forgotPasswordButton}
                  onPress={() => router.push("/(screens)/Login/ForgetPassword")}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forget Password ?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.loginbutton}
              activeOpacity={0.7}
            >
              <AppButton
                title={"Login"}
                buttonColor={Colors.blue}
                loading={loading}
              />
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* social media */}
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          marginVertical: RFPercentage(2),
        }}
      >
        <View
          style={{
            width: "46%",
            marginTop: RFPercentage(1),
            height: RFPercentage(0.06),
            backgroundColor: Colors.stroke,
            borderRadius: RFPercentage(0.5),
          }}
        />
        <View
          style={{
            width: "8%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ color: Colors.lightBlack, fontFamily: FontFamily.regular }}
          >
            or
          </Text>
        </View>

        <View
          style={{
            width: "46%",
            marginTop: RFPercentage(1),
            height: RFPercentage(0.06),
            backgroundColor: Colors.stroke,
            borderRadius: RFPercentage(0.5),
          }}
        />
      </View>
      {/* authetication by google apple fb */}

      <View style={styles.socialmain}>
        <View style={styles.appfbgcontainer}>
          <Image style={styles.fbglogo} source={icons.google} />
        </View>
        <View style={styles.appfbgcontainer}>
          <Image style={styles.fbglogo} source={icons.fb} />
        </View>
      </View>

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
          Don’t have an account ?
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(screens)/Login/SignupScreen")}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: Colors.blue,
              fontFamily: FontFamily.semiBold,
              fontSize: RFPercentage(1.5),
            }}
          >
            Sign up
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
    width: "90%",
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
    marginTop: RFPercentage(8),
  },

  forgotPasswordButton: {
    marginTop: RFPercentage(2),
    position: "absolute",
    right: RFPercentage(2),
  },
  forgotPasswordText: {
    color: Colors.lightBlack,
    fontFamily: FontFamily.regular,
    fontSize: RFPercentage(1.8),
  },
  buttontext: {
    color: Colors.white,
    fontSize: RFPercentage(1.8),
    fontFamily: FontFamily.semiBold,
  },
  appfbgcontainer: {
    width: "49%",
    paddingVertical: RFPercentage(1.5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: RFPercentage(0.1),
    borderColor: Colors.stroke,
    borderRadius: RFPercentage(1),
  },
  socialmain: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fbglogo: {
    width: RFPercentage(3),
    height: RFPercentage(3),
  },
});
