import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { database, ref, update, onValue } from "../firebaseConfig";
import colors from "../assets/colors";

const ReportViewScreen = () => {
  const route = useRoute();
  const { report } = route.params;
  const navigation = useNavigation();
  const [isCompleted, setIsCompleted] = useState(
    report.reviewStatus === "Completed"
  );

  useEffect(() => {
    const reportRef = ref(database, `RecycleWasteCollection/${report.id}`);

    const unsubscribe = onValue(reportRef, (snapshot) => {
      const updatedReport = snapshot.val();
      if (updatedReport.reviewStatus === "Completed") {
        setIsCompleted(true);
      }
    });

    return () => unsubscribe();
  }, [report.id]);

  const handleBack = () => {
    navigation.navigate("History");
  };

  // Function to update the review status to 'Completed'
  const handleCompleteReview = () => {
    Alert.alert(
      "Confirm Completion",
      "Are you sure you want to complete this review?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const reportRef = ref(
              database,
              `RecycleWasteCollection/${report.id}`
            );

            update(reportRef, { reviewStatus: "Completed" })
              .then(() => {
                console.log("Review status updated to Completed");
                setIsCompleted(true); // Disable the button after update
                Alert.alert("Success", "Review status updated to Completed");
                navigation.navigate("History");
              })
              .catch((error) => {
                console.error("Error updating review status: ", error);
                Alert.alert(
                  "Error",
                  "Failed to update review status. Please try again."
                );
              });
          },
        },
      ]
    );
  };

  const statusColor = isCompleted ? "green" : "red";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recycle Waste Collection Details</Text>
      <Text style={styles.label}>Owner Name: {report.ownerName}</Text>
      <Text style={styles.label}>Address: {report.houseAddress}</Text>
      <Text style={styles.label}>Date: {report.dateAndTime}</Text>
      <Text style={styles.label}>Waste Type: {report.wasteType}</Text>
      <Text style={styles.label}>Weight: {report.weight} Kg</Text>
      <Text style={[styles.label, { color: statusColor }]}>
        Review Status: {report.reviewStatus}
      </Text>

      <TouchableOpacity
        style={[styles.completeButton, isCompleted && styles.buttonDisabled]}
        onPress={handleCompleteReview}
        disabled={isCompleted}
      >
        <Text style={styles.completeButtonText}>Complete Review</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
  },
  completeButtonText: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default ReportViewScreen;
