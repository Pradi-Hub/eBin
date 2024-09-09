import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#E6F2F1",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  checkIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#00CE5E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 70,
    color: "#fff",
  },
  successText: {
    fontSize: 20,
    color: "#00CE5E",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  qouteText: {
    fontSize: 16,
    color: "#00CE5E",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  okButton: {
    backgroundColor: "#00CE5E",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  okButtonText: {
    color: "#fff",
    fontSize: 24,
  },
});

export default SuccessScreen;
