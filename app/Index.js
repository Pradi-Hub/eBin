import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { database, ref, push } from "../firebaseConfig";
import RNPickerSelect from "react-native-picker-select";
import colors from "../assets/colors";

const Index = () => {
  const [houseAddress, setHouseAddress] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // Function to check if a string contains only letters
  const isAlphabetic = (text) => /^[A-Za-z\s]+$/.test(text);

  // Function to check if a string is numeric
  const isNumeric = (text) => /^\d+(\.\d+)?$/.test(text);

  useEffect(() => {
    // Animate error messages when they are set
    if (Object.keys(error).length > 0) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  const handleSubmit = async () => {
    // Reset errors
    setError({});

    // Validate input
    let isValid = true;
    let newErrors = {};

    if (!houseAddress.trim()) {
      newErrors.houseAddress = "House address is required";
      isValid = false;
    }

    if (!ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
      isValid = false;
    } else if (!isAlphabetic(ownerName)) {
      newErrors.ownerName = "Owner name should contain only letters";
      isValid = false;
    }

    if (!wasteType) {
      newErrors.wasteType = "Recycle Waste Type is required";
      isValid = false;
    }

    if (!weight.trim()) {
      newErrors.weight = "Weight is required";
      isValid = false;
    } else if (!isNumeric(weight)) {
      newErrors.weight = "Weight should contain only Numbers";
      isValid = false;
    }

    if (!isValid) {
      setError(newErrors);
      return; // Stop if validation fails
    }

    try {
      setLoading(true);

      // Get the current date and time
      const timestamp = Date.now();
      const dateAndTime = new Date(timestamp).toLocaleString();
      const reviewStatus = "Pending review";

      // Create a reference to the "forms" node
      const recycleWasteCollectionRef = ref(database, "RecycleWasteCollection");

      // Use the push function to add a new entry
      await push(recycleWasteCollectionRef, {
        houseAddress,
        ownerName,
        wasteType,
        weight,
        dateAndTime,
        reviewStatus,
      });

      // Reset form fields
      setHouseAddress("");
      setOwnerName("");
      setWasteType("");
      setWeight("");

      // Redirect to Success screen
      navigation.navigate("Success");
    } catch (error) {
      console.error("Error submitting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.TopBarContainer}>
          <View style={styles.backButton}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={34} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.TopBar}>Recycle Waste Info</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.LableContainer}>
            <Text style={styles.label}>House Address :</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="House Address"
            value={houseAddress}
            onChangeText={setHouseAddress}
          />
          {error.houseAddress && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.houseAddress}</Text>
            </Animated.View>
          )}
          <View style={styles.LableContainer}>
            <Text style={styles.label}>Owner Name :</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="Owner Name"
            value={ownerName}
            onChangeText={setOwnerName}
          />
          {error.ownerName && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.ownerName}</Text>
            </Animated.View>
          )}

          {/* Recycle Waste Type Picker */}
          <View style={styles.LableContainer}>
            <Text style={styles.label}>Recycle Waste Type :</Text>
          </View>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setWasteType(value)}
              items={[
                { label: "Paper", value: "Paper" },
                { label: "Plastic", value: "Plastic" },
                { label: "Glass", value: "Glass" },
                { label: "Metal", value: "Metal" },
                { label: "Organic", value: "Organic" },
              ]}
              placeholder={{ label: "Select a waste type...", value: null }}
              style={pickerSelectStyles}
            />
            {error.wasteType && (
              <Animated.View style={{ opacity: opacityAnim }}>
                <Text style={styles.errorText}>{error.wasteType}</Text>
              </Animated.View>
            )}
          </View>

          <View style={styles.LableContainer}>
            <Text style={styles.label}>Weight :</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="eg : 2 Kg --> 1 or 500 g --> 0.5 "
            value={weight}
            onChangeText={setWeight}
          />
          {error.weight && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.weight}</Text>
            </Animated.View>
          )}
          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#00CE5E",
    borderRadius: 10,
    color: "black",
    paddingRight: 30, // to ensure the text is not cut off by the dropdown arrow
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#00CE5E",
    borderRadius: 10,
    color: "black",
    paddingRight: 30, // to ensure the text is not cut off by the dropdown arrow
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    overflow: "auto",
  },
  TopBarContainer: {
    backgroundColor: "#00CE5E",
    flex: 0,
    width: "100%",
    borderBottomStartRadius: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight * 2 : 0,
    position: "relative",
  },
  TopBar: {
    fontSize: Platform.OS === "android" || Platform.OS === "ios" ? 30 : 40,
    textAlign: "center",
    fontSize: 32,
    top: -20,
    color: colors.white,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    marginTop: 15,
    left: 10,
    top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  formContainer: {
    position: "absolute",
    marginTop: 150,
    width: "100%",
    justifyContent: "center",
  },
  LableContainer: {
    paddingTop: 10,
  },
  label: {
    paddingLeft: 20,
    fontSize: 24,
    color: "#00CE5E",
  },
  inputBox: {
    height: 50,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderColor: "#00CE5E",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 100 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      web: {
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
      },
    }),
    zIndex: 10,
  },
  ButtonContainer: {
    flex: 1,
    top: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  button: {
    width: 320,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00CE5E",
    borderRadius: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    paddingLeft: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    height: 50,
    margin: 12,
    borderWidth: 2,
    borderColor: "#00CE5E",
    borderRadius: 10,
  },
});

export default Index;
