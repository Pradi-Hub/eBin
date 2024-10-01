import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../assets/colors";

const SuccessScreen = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate("QRScan");
  };

  const handleOk = () => {
    navigation.navigate("QRScan");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={require("../assets/images/back-btn.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Robot and Garbage Bin Image */}
      <Image
        source={require("../assets/images/binLogo.png")}
        style={styles.robotImage}
      />

      {/* Success Message Container */}
      <View style={styles.messageContainer}>
        <View style={styles.checkIconContainer}>
          {/* Check Icon */}
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        {/* Success Text */}
        <Text style={styles.successText}>
          Recycle Waste Collected Successfully!
        </Text>

        {/* OK Button */}
        <TouchableOpacity style={styles.okButton} onPress={handleOk}>
          <Text style={styles.okButtonText}>Ok</Text>
        </TouchableOpacity>

        <Text style={styles.qouteText}>Recycle More, Earn More!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  robotImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  messageContainer: {
    width: "80%",
    backgroundColor: colors.lprimary,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  checkIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 70,
    color: colors.white,
  },
  successText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  qouteText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  okButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  okButtonText: {
    color: colors.white,
    fontSize: 24,
  },
});

export default SuccessScreen;
