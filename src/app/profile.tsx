import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../App";
import API from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

interface User {
  name: string;
  email: string;
}

export default function ProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<User>({ name: "", email: "" });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
      setForm(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await API.put("/users/me", form);
      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {editMode ? (
            <>
              <Text>Name</Text>
              <TextInput
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                style={styles.input}
              />
              <Text>Email</Text>
              <TextInput
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                style={styles.input}
              />
              <Button title="Save" onPress={handleUpdate} />
            </>
          ) : (
            <>
              <Text>Name: {user.name}</Text>
              <Text>Email: {user.email}</Text>
              <Button title="Edit" onPress={() => setEditMode(true)} />
              <View style={{ marginTop: 10 }}>
                <Button title="Logout" onPress={handleLogout} color="red" />
              </View>
            </>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});
