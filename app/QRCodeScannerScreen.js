import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../assets/colors";

const QRCodeScannerScreen = () => {
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      // Redirect to Success screen
      navigation.navigate("Index");
    } catch (error) {
      console.error("Error Scanning code: ", error);
    }
  };

  const handleHistory = () => {
    // Navigate to the Scan History screen
    navigation.navigate("History");
  };

  return (
    <View style={styles.container}>
      {/* Button with PNG Icon to navigate to Scan History */}
      <TouchableOpacity style={styles.historyButton} onPress={handleHistory}>
        <Image
          source={require("../assets/images/history-icon.png")} // Replace with the path to your history icon PNG
          style={styles.historyIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Scan QR code</Text>
      <Text style={styles.subtitle}>
        Place qr code inside the frame to scan please avoid shake to get results
        quickly
      </Text>

      <View style={styles.qrScanner}>
        {/* Placeholder for QR Scanner */}
        <View style={styles.qrPlaceholder}>
          <Image
            source={require("../assets/images/qr-code.png")}
            style={styles.qrImage}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scanning code...</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.requestButton} onPress={handleSubmit}>
        <Text style={styles.requestButtonText}>Recycle Collection Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  historyButton: {
    position: "absolute",
    top: 70,
    right: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  historyIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#a1a1a1",
    textAlign: "center",
    marginBottom: 30,
  },
  qrScanner: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: "#E6F4F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  qrImage: {
    width: 150,
    height: 150,
    tintColor: colors.primary, // Adjust the color to match the theme
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
  },
  scanButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginTop: 25,
    borderRadius: 25,
    alignItems: "center",
  },
  requestButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QRCodeScannerScreen;
