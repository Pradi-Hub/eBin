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
import colors from "../assets/colors";

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
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Storage permission is required to save files."
        );
        return;
      }

      const htmlContent = `
      <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #00CE5E;
            color: white;
          }
        </style>
      </head>
      <body>
        <h1>Scan History Report</h1>
        <table>
          <tr>
            <th>House Address</th>
            <th>Owner Name</th>
            <th>Date</th>
          </tr>
          ${filteredData
            .map(
              (item) => `
              <tr>
                <td>${item.houseAddress}</td>
                <td>${item.ownerName}</td>
                <td>${item.readableDate}</td>
              </tr>
            `
            )
            .join("")}
        </table>
      </body>
      </html>
    `;

      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      console.log("PDF file created at:", pdfUri); // Log PDF URI

      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(pdfUri);
      if (!fileInfo.exists) {
        throw new Error("The file does not exist at the new path.");
      }

      // Attempt to create an asset and save it
      const asset = await MediaLibrary.createAssetAsync(pdfUri);
      if (!asset) {
        throw new Error("Failed to create asset.");
      }

      // Optionally create an album if you want to organize the saved PDFs
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      Alert.alert("Success", "PDF saved to Downloads folder");

      // Share the PDF file after saving
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
        <Text style={styles.itemTitle}>
          {item.ownerName || "No Owner Name Available"}
        </Text>
        <Text style={styles.itemSubtitle}>
          {item.reviewStatus || "No Review Status Available"}
        </Text>
        <Text style={styles.itemSubtitle}>
          {item.dateAndTime || "No Date Available"}
        </Text>
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
    backgroundColor: colors.white,
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
    color: colors.primary,
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
    backgroundColor: colors.grey,
  },
  selectedTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.black,
  },
  downloadAllButton: {
    backgroundColor: colors.grey,
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadAllButtonText: {
    color: colors.black,
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
    color: colors.subitm,
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
