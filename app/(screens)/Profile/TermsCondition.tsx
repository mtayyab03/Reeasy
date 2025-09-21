import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

// constants
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/font";
import icons from "@/constants/icons";
import { fontSize } from "@/constants/fontUtils";
//Components
import Screen from "@/components/common/Screen";
import AppHeader from "@/components/common/AppHeader";

const TermsCondition = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <Screen style={styles.screen}>
      <AppHeader title="Terms & Conditions" onPress={() => handleBack()} />
      <View style={{ width: "90%", marginTop: RFPercentage(3) }}>
        <Text
          style={{
            color: Colors.blacky,
            fontFamily: FontFamily.semiBold,
            fontSize: fontSize(16),
            marginBottom: RFPercentage(2),
          }}
        >
          Reeasy Terms and Conditions
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: RFPercentage(25) }}
        >
          <Text
            style={{
              color: Colors.lightBlack,
              fontFamily: FontFamily.regular,
              fontSize: RFPercentage(1.3),
              marginTop: RFPercentage(1),
              lineHeight: 25,
            }}
          >
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              1. Acceptance.
            </Text>{" "}
            By accessing or using Reeasy (“App”), you agree to these Terms and
            our Privacy Policy. If you do not agree, do not use the App.{"\n"}
            {"\n"}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              2. Eligibility & Account.{" "}
            </Text>{" "}
            You must be at least 18 years. You’re responsible for your account
            and password. We may suspend or terminate for violations.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              3. License.
            </Text>{" "}
            We grant you a limited, non-exclusive, revocable, non-transferable
            license to use the App for personal or business use, subject to
            these Terms.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              4. User Content.
            </Text>{" "}
            You retain rights to content you submit. You grant us a worldwide,
            royalty-free license to host, store, reproduce, and display it to
            operate and improve the App. Do not post illegal, infringing, or
            harmful content. We may remove content at our discretion.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              5. Prohibited Uses.
            </Text>{" "}
            You agree not to: (a) reverse engineer; (b) scrape or harvest data;
            (c) interfere with security or operation; (d) use the App for
            unlawful purposes; (e) infringe IP rights.{"\n"}
            {"\n"}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              {" "}
              6. Fees & Subscriptions.
            </Text>{" "}
            If you purchase in-app service, you authorize Reeasy LLC FZ to
            charge you.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              7. Third-Party Services.
            </Text>{" "}
            The App may link to third-party content or services. We are not
            responsible for their terms or policies.{"\n"}
            {"\n"}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              {" "}
              8. Privacy & Permissions.
            </Text>{" "}
            See our Privacy Policy for how we collect and use data. The App may
            granted permissions by the user to store private and personal data
            to provide features.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              9. Updates & Availability.
            </Text>{" "}
            We may modify, suspend, or discontinue the App or any feature
            without liability.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              10. Intellectual Property.
            </Text>{" "}
            The App and its content are owned by Reeasy LLZ FZ and protected by
            IP laws.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              11. Disclaimers.
            </Text>{" "}
            THE APP IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF
            ANY KIND, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            {"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              12. Limitation of Liability.
            </Text>{" "}
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, Reeasy LLC FZ WILL NOT BE
            LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES. OUR TOTAL LIABILITY WILL NOT EXCEED $ 500.00 per shipment.
            {"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              13. Indemnification.{" "}
            </Text>{" "}
            You agree to indemnify and hold Reeasy LLC FZ harmless from claims
            arising out of your use of the App or violation of these Terms.
            {"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              14. Governing Law & Disputes.
            </Text>{" "}
            These Terms are governed by the laws of United Arab Emirates
            Disputes will be resolved in courts located in UAE.
            {"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              15. Termination.
            </Text>{" "}
            We may suspend or terminate your access at any time for any or no
            reason.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              {" "}
              16. Changes.
            </Text>{" "}
            We may update these Terms by posting a new version with an updated
            date. Continued use means you accept the changes.{"\n"}
            {"\n"}{" "}
            <Text
              style={{ fontFamily: FontFamily.bold, color: Colors.lightBlack }}
            >
              {" "}
              17. Contact.
            </Text>{" "}
            Reeasy LLC FZ, UAE, legal@reeasy.com.
          </Text>
        </ScrollView>
      </View>
    </Screen>
  );
};

export default TermsCondition;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});
