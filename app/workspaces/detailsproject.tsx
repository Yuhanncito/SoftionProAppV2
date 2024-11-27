import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLocalSearchParams, router } from 'expo-router';
import { getProjects } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectInfoScreen = () => {
  const { projectId, WorkUser } = useLocalSearchParams(); // Obtenemos el projectId como parámetro
  const [project, setProject] = useState(null); // Estado para los datos del proyecto
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga

  const fetchProjectData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const projectData = await getProjects(token, projectId); // Llama a la API para obtener los datos del proyecto
      setProject(projectData); // Guarda los datos del proyecto en el estado
      setLoading(false); // Finaliza la carga
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al obtener los datos del proyecto');
      setLoading(false); // Finaliza la carga en caso de error
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{project?.nameProject}</Text>
      </View>

      {/* Descripción */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="pencil" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.sectionContent}>{project?.description || "Sin descripción"}</Text>
      </View>

      {/* Tareas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tareas</Text>
        <FlatList
          data={project?.tasks}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>{item.nameTask}</Text>
              <Text style={styles.taskInfo}>Horas: {item.timeHoursTaks}</Text>
              <Text style={styles.taskStatus}>{item.status}</Text>
              <TouchableOpacity style={styles.deleteIcon}>
                <Icon name="close-circle-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Estado */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado</Text>
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="pencil" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.sectionContent}>{project?.status}</Text>
      </View>

      {/* Área de trabajo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Área de trabajo</Text>
        <Text style={styles.sectionContent}>WorkSpace de {WorkUser || "Desconocido"}</Text>
      </View>

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  taskCard: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  taskInfo: {
    fontSize: 12,
    color: '#555',
  },
  taskStatus: {
    fontSize: 12,
    color: '#007AFF',
  },
  deleteIcon: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProjectInfoScreen;
