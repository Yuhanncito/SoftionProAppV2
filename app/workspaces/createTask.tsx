import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams, router } from "expo-router";
import { insertNewTask } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateTask = () => {
  const { projectId, WorkUser, workspaceId } = useLocalSearchParams();
  const [nameTask, setNameTask] = useState("");
  const [descriptionTask, setDescriptionTask] = useState("");
  const [timeHoursTaks, setTimeHoursTaks] = useState("");

  const handleCreateTask = async () => {
    if (!nameTask.trim() || !descriptionTask.trim() || !timeHoursTaks.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      const newTaskData = {
        projectRelation: projectId,
        nameTask,
        descriptionTask,
        timeHoursTaks: parseFloat(timeHoursTaks),
        status: "Pendiente",
        workspaceid: workspaceId,
      };

      const result = await insertNewTask(token, newTaskData);
      if (result.message === "ok") {
        Alert.alert("Éxito", "Tarea creada correctamente.");
        router.back();
      } else {
        Alert.alert("Error", result.message || "No se pudo agregar la tarea.");
      }
    } catch (error) {
      console.log("Error en la creación de la tarea:", error);
      Alert.alert("Error", "Hubo un problema al agregar la tarea.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Nueva Tarea</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre de la Tarea</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre de la tarea"
            placeholderTextColor="#888"
            value={nameTask}
            onChangeText={setNameTask}
          />

          <Text style={styles.label}>Descripción de la Tarea</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe la tarea brevemente"
            placeholderTextColor="#888"
            value={descriptionTask}
            onChangeText={setDescriptionTask}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Horas trabajadas</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 1.5"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={timeHoursTaks}
            onChangeText={setTimeHoursTaks}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleCreateTask}>
              <Text style={styles.addButtonText}>Crear Tarea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
