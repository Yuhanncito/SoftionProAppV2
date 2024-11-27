import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useLocalSearchParams, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getProjects, insertNewTask, deleteTask, getWorkSpacesById } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProjectDetails = () => {
  const { projectId, WorkUser, workspaceId } = useLocalSearchParams();
  const [Task, setTask] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [Workspace, setWorkspace] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // Estado para la recarga

  const fetchTasks = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.log("Token no encontrado");
      return;
    }
    const projectTasks = await getProjects(token, projectId);
    const workspaces = await getWorkSpacesById(token, workspaceId);
    setWorkspace(workspaces);
    setTask(projectTasks);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const toggleTaskExpansion = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      Alert.alert("Error", "El nombre de la tarea es obligatorio.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      const newTaskData = {
        projectRelation: projectId,
        nameTask: newTaskName,
        descriptionTask: "",
        timeHoursTaks: 0,
        status: "Pendiente",
        workspaceid: workspaceId,
      };

      const result = await insertNewTask(token, newTaskData);

      if (result.message === "ok") {
        setNewTaskName("");
        fetchTasks();
        Alert.alert("Éxito", "Tarea creada correctamente.");
      } else {
        Alert.alert("Error", result.message || "No se pudo agregar la tarea.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Hubo un problema al agregar la tarea.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      "Eliminar Tarea",
      "¿Estás seguro de que deseas eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              const result = await deleteTask(token, taskId, workspaceId);

              if (result.message === "ok") {
                setTask((prevTask) => ({
                  ...prevTask,
                  tasks: prevTask.tasks.filter((task) => task._id !== taskId),
                }));
                Alert.alert("Éxito", "Tarea eliminada correctamente.");
              } else {
                Alert.alert("Error", result.message || "No se pudo eliminar la tarea.");
              }
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Hubo un problema al eliminar la tarea.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{Task?.nameProject}</Text>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() =>
            router.push({
              pathname: "/workspaces/detailsproject",
              params: { projectId: projectId, WorkUser: WorkUser },
            })
          }
        >
          <Icon name="information-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Tareas: {Task?.tasks.length}</Text>
      <TextInput
        style={styles.newTaskInput}
        placeholder="Crea una nueva tarea"
        placeholderTextColor="#888"
        value={newTaskName}
        onChangeText={setNewTaskName}
        onSubmitEditing={handleAddTask}
      />
      <FlatList
        data={Task?.tasks}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity onPress={() => toggleTaskExpansion(item._id)}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{item.nameTask}</Text>
                <Text style={styles.taskInfo}>Horas: {item.timeHoursTaks}</Text>
                <Text style={styles.taskStatus}>{item.status}</Text>
                <Icon
                  name={expandedTaskId === item._id ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#007AFF"
                />
              </View>
            </TouchableOpacity>
            {expandedTaskId === item._id && (
              <View style={styles.expandedContent}>
                <Text style={styles.taskDescription}>Descripción: {item.descriptionTask}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/workspaces/detailsTask',
                        params: { 
                          projectId: projectId, 
                          WorkUser: WorkUser, 
                          workspaceId: workspaceId,
                          taskId: item._id // Pasar el ID de la tarea seleccionada
                        }
                      })
                    }
                    style={styles.editButton}
                  >
                    <Icon name="pencil" size={20} color="white" />
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleDeleteTask(item._id)} 
                    style={styles.deleteButton}
                  >
                    <Icon name="trash" size={20} color="white" />
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          router.push({
            pathname: "/workspaces/createTask",
            params: { projectId: projectId, WorkUser: WorkUser, workspaceId: workspaceId },
          })
        }
      >
        <Icon name="add-circle" size={48} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

export default ProjectDetails;

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 15,
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 15,
  },
  newTaskInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  taskInfo: {
    fontSize: 16,
    color: "#555",
  },
  taskStatus: {
    fontSize: 14,
    color: "#007AFF",
    marginLeft: 10,
  },
  expandedContent: {
    marginTop: 10,
  },
  taskDescription: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
