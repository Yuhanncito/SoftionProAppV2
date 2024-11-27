import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { getTasks, updateTask } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProjectInfoScreen = () => {
  const { projectId, WorkUser, workspaceId, taskId } = useLocalSearchParams();
  const [name, setName] = useState(""); // Campo para el nombre de la tarea
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [hours, setHours] = useState(0);
  const [participants, setParticipants] = useState([]);

  const fetchTaskDetails = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) return;

    try {
      const tasks = await getTasks(token, projectId);
      console.log("Datos recibidos de getTasks:", tasks);

      if (tasks && tasks.length > 0) {
        const taskDetails = tasks.find((task) => task._id === taskId);
        if (taskDetails) {
          setName(taskDetails.nameTask);
          setDescription(taskDetails.descriptionTask);
          setStatus(taskDetails.status);
          setHours(taskDetails.timeHoursTaks);
          setParticipants(taskDetails.userTasks || []);
        } else {
          Alert.alert("Error", "No se encontró la tarea con el ID proporcionado");
        }
      } else {
        Alert.alert("Error", "No se encontraron tareas para este proyecto");
      }
    } catch (error) {
      console.log("Error al obtener los detalles de la tarea:", error);
      Alert.alert("Error", "No se pudo cargar la información de la tarea.");
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) return;
  
    const updatedData = {
      _id: taskId,
      nameTask: name,
      descriptionTask: description,
      status: status,
      timeHoursTaks: hours,
      workspaceid: workspaceId, // Incluimos el workspaceId en la actualización
    };
  
    try {
      const result = await updateTask(token, updatedData);
      if (result.message === "ok") {
        Alert.alert("Éxito", "Tarea actualizada correctamente.");
        router.back(); // Navega a la pantalla anterior después de una actualización exitosa
      } else {
        Alert.alert("Error", result.message || "No se pudo actualizar la tarea.");
      }
    } catch (error) {
      console.log("Error al actualizar la tarea:", error);
      Alert.alert("Error", "Hubo un problema al actualizar la tarea.");
    }
  };
  

  const renderParticipant = ( item: any ) => (
    <View style={styles.participantCard}>
      <Icon name="person-circle-outline" size={40} color="#555" />
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{item.name}</Text>
        <Text style={styles.participantEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity>
        <Icon name="close-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles de la Tarea</Text>
      </View>
  
      {/* Resto de los campos de entrada */}
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nombre</Text>
              <TextInput
                style={styles.sectionContent}
                value={name}
                onChangeText={setName}
                placeholder="Nombre de la tarea"
              />
            </View>
  
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <TextInput
                style={styles.sectionContent}
                value={description}
                onChangeText={setDescription}
                placeholder="Descripción de la tarea"
              />
            </View>
  
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Horas Dedicadas</Text>
              <TextInput
                style={styles.sectionContent}
                value={String(hours)}
                onChangeText={(value) => setHours(Number(value))}
                keyboardType="numeric"
                placeholder="Horas dedicadas"
              />
            </View>
  
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estado</Text>
              <TextInput
                style={styles.sectionContent}
                value={status}
                onChangeText={setStatus}
                placeholder="Estado"
              />
            </View>
  
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Responsables</Text>
              <FlatList
                data={participants}
                keyExtractor={(item) => item.id}
                renderItem={renderParticipant}
                contentContainerStyle={styles.participantsList}
              />
            </View>
          </>
        }
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={renderParticipant}
        contentContainerStyle={styles.participantsList}
        ListFooterComponent={
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
  
};

export default ProjectInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    paddingTop: 43,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    top: 25,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});