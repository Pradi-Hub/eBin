import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Index from "./app/Index";
import SuccessScreen from "./app/SuccessScreen";
import QRCodeScannerScreen from "./app/QRCodeScannerScreen";
import ScanHistoryScreen from "./app/ScanHistoryScreen";
import ReportViewScreen from "./app/ReportViewScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QRScan">
        <Stack.Screen
          name="Index"
          component={Index}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QRScan"
          component={QRCodeScannerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={ScanHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReportView"
          component={ReportViewScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
