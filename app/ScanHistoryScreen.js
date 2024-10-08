import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { database, ref, onValue, query, orderByChild } from "../firebaseConfig";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Platform } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { parse, compareDesc, isToday } from "date-fns";

const ScanHistoryScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Today");
  const [scanData, setScanData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // New state for filtered data
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate("QRScan");
  };

  useEffect(() => {
    const dataRef = query(
      ref(database, "RecycleWasteCollection"),
      orderByChild("dateAndTime")
    );

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const fetchedData = [];
      snapshot.forEach((childSnapshot) => {
        fetchedData.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });

      console.log("Fetched Data:", fetchedData);

      // Date format in the data is "MM/dd/yyyy, hh:mm:ss a"
      const dateFormat = "M/d/yyyy, h:mm:ss a"; // Adjusted to handle single digits in months and hours

      const sortedData = fetchedData.sort((a, b) => {
        if (!a.dateAndTime || !b.dateAndTime) {
          console.error("Missing dateAndTime field:", a, b);
          return 0;
        }

        try {
          // Parse the custom date format
          const dateA = parse(a.dateAndTime, dateFormat, new Date());
          const dateB = parse(b.dateAndTime, dateFormat, new Date());

          return compareDesc(dateA, dateB); // Sort in descending order
        } catch (error) {
          console.error("Error parsing dates:", error);
          return 0;
        }
      });

      console.log("Sorted Data:", sortedData);
      setScanData(sortedData);
      setFilteredData(sortedData); // Initialize filtered data with sorted data
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filter data based on the selected tab
    if (selectedTab === "Today") {
      const todayData = scanData.filter((item) => {
        const itemDate = parse(
          item.dateAndTime,
          "M/d/yyyy, h:mm:ss a",
          new Date()
        );
        return isToday(itemDate);
      });
      setFilteredData(todayData);
    } else {
      setFilteredData(scanData); // Show all data if "All" is selected
    }
  }, [selectedTab, scanData]);

  const handleViewReport = (item) => {
    navigation.navigate("ReportView", { report: item });
  };

  const handleDownload = async (item) => {
    Alert.alert("Download", `Downloading report for ${item.name}`);
    // You can implement a specific download logic here if needed
  };

  const handleDownloadAll = async () => {
    try {
      // Request permission to access the device's media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Storage permission is required to save files."
        );
        return;
      }

      // Generate HTML content for the PDF
      const htmlContent = filteredData
        .map(
          (item) => `
          <h1>${item.houseAddress}</h1>
          <p>Location: ${item.ownerNam}</p>
          <p>Date: ${item.readableDate}</p>
          <hr/>
        `
        )
        .join("");

      // Create PDF from HTML content using expo-print
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      // Check if the URI is valid
      if (!pdfUri) {
        throw new Error("Failed to create PDF file. The URI is invalid.");
      }

      console.log("PDF file created at:", pdfUri); // Debugging log to verify the file path

      if (Platform.OS === "android") {
        try {
          // Check if the file exists at the new path
          const fileInfo = await FileSystem.getInfoAsync(pdfUri);
          if (!fileInfo.exists) {
            throw new Error("The file does not exist at the new path.");
          }

          // Try to create an asset and save it to the Media Library
          const asset = await MediaLibrary.createAssetAsync(pdfUri);
          await MediaLibrary.createAlbumAsync("Download", asset, false);
          Alert.alert("Success", "PDF saved to Downloads folder");
        } catch (mediaError) {
          console.error("MediaLibrary error:", mediaError);
          Alert.alert(
            "Error",
            "Failed to save the PDF to the Downloads folder."
          );
        }
      } else {
        // Handle for iOS or other platforms if needed
      }

      // Optionally, you can share the file after saving
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error creating or sharing PDF:", error);
      Alert.alert("Error", "Failed to download the PDF. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Image
        source={require("../assets/images/file-icon.png")}
        style={styles.fileIcon}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.location}</Text>
        <Text style={styles.itemSubtitle}>{item.readableDate}</Text>
      </View>
      <View style={styles.actionIcons}>
        <TouchableOpacity onPress={() => handleViewReport(item)}>
          <Image
            source={require("../assets/images/view-icon.png")}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDownload(item)}>
          <Image
            source={require("../assets/images/download-icon.png")}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Image
          source={require("../assets/images/back-btn.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scanning History</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Today" && styles.selectedTab]}
          onPress={() => setSelectedTab("Today")}
        >
          <Text style={styles.tabText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "All" && styles.selectedTab]}
          onPress={() => setSelectedTab("All")}
        >
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downloadAllButton}
          onPress={handleDownloadAll}
        >
          <Text style={styles.downloadAllButtonText}>Download All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData} // Use filtered data instead of scanData
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    marginTop: 70,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00CE5E",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedTab: {
    backgroundColor: "#00CE5E",
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  downloadAllButton: {
    backgroundColor: "#f0f0f0",
    borderColor: "#00CE5E",
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadAllButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  list: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  fileIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});

export default ScanHistoryScreen;
