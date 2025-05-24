import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleContinue = async () => {
    if (!name.trim()) return;

    await AsyncStorage.setItem("userName", name);
    await AsyncStorage.setItem("hasSeenWelcome", "true"); // So we don't show onboarding next time

    router.replace("/"); // 👈 This takes user to the Home screen (index.tsx)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F0F8FF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#3399FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
