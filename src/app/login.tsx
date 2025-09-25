import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import API from "../services/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("shakisk23@gmail.com");
  const [password, setPassword] = useState("11111111");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data?.access_token;

      if (token) {
        await AsyncStorage.setItem("token", token);
        router.push("/profile"); //
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      setError("Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});
