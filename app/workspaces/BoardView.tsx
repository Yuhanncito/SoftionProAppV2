import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateTask } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BoardView = ( tareas:any ) => {
  const [tasks, setTasks] = useState(tareas);

  const handleDragEnd = async ( data: any, from: any, to: any, section:any ) => {
    const updatedTasks = [...tasks];
    const taskToMove = updatedTasks[from];
  
    // Calculate section boundaries for each status
    const pendienteLimit = tasksByStatus('Pendiente').length;
    const iniciadoLimit = pendienteLimit + tasksByStatus('Iniciado').length;
  
    // Determine new status based on the section where the task is dropped
    let newStatus;
    switch (section) {
      case 'Pendiente':
        newStatus = 'Pendiente';
        break;
      case 'Iniciado':
        newStatus = 'Iniciado';
        break;
      case 'Concluido':
        newStatus = 'Concluido';
        break;
      default:
        return;
    }
  
    // Only update if the status actually changes
    if (taskToMove.status !== newStatus) {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Token no encontrado');
        return;
      }
  
      // Prepare the updated task data to send to the backend
      const updatedTaskData = { ...taskToMove, status: newStatus };
      try {
        const result = await updateTask(token, updatedTaskData);
        if (result.message === 'ok') {
          // Update the local status of the task
          taskToMove.status = newStatus;
  
          // Update the positions within local state
          updatedTasks.splice(from, 1); // Remove the task from the original position
          updatedTasks.splice(to, 0, taskToMove); // Insert the task into the new position
  
          // Update the task list state with reordered tasks
          setTasks(updatedTasks);
          Alert.alert('Éxito', 'Estado de la tarea actualizado correctamente');
        } else {
          Alert.alert('Error', 'No se pudo actualizar el estado de la tarea en el servidor');
        }
      } catch (error) {
        console.error("Error updating task status:", error);
        Alert.alert("Error", "Hubo un problema al actualizar la tarea en el servidor.");
      }
    } else {
      // If the status didn't change, update local positions only
      updatedTasks.splice(from, 1);
      updatedTasks.splice(to, 0, taskToMove);
      setTasks(updatedTasks);
    }
  };
  

  const tasksByStatus = (status:any) => tasks.filter(task => task.status === status);

  const renderTaskCard = ({ item, drag, isActive }) => (
    <TouchableOpacity
      style={[
        styles.taskCard,
        { backgroundColor: isActive ? '#f0f0f0' : '#fff' }
      ]}
      onLongPress={drag}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.nameTask}</Text>
        <TouchableOpacity>
          <Icon name="close-circle" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.taskInfo}>Horas: {item.timeHoursTaks}</Text>
      <Text style={styles.taskStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    console.log("Tareas en el tablero: ", tareas);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Pendiente</Text>
      <View style={[styles.scrollContainer, styles.pendienteContainer]}>
        <DraggableFlatList
          data={tasksByStatus('Pendiente')}
          renderItem={(props) => renderTaskCard({ ...props, section: 'Pendiente' })}
          keyExtractor={(item) => item._id.toString()}
          onDragEnd={({ data, from, to }) => handleDragEnd({ data, from, to, section: 'Pendiente' })}
        />
      </View>

      <Text style={styles.sectionHeader}>Iniciado</Text>
      <View style={[styles.scrollContainer, styles.iniciadoContainer]}>
        <DraggableFlatList
          data={tasksByStatus('Iniciado')}
          renderItem={(props) => renderTaskCard({ ...props, section: 'Iniciado' })}
          keyExtractor={(item) => item._id.toString()}
          onDragEnd={({ data, from, to }) => handleDragEnd({ data, from, to, section: 'Iniciado' })}
        />
      </View>

      <Text style={styles.sectionHeader}>Concluido</Text>
      <View style={[styles.scrollContainer, styles.concluidoContainer]}>
        <DraggableFlatList
          data={tasksByStatus('Concluido')}
          renderItem={(props) => renderTaskCard({ ...props, section: 'Concluido' })}
          keyExtractor={(item) => item._id.toString()}
          onDragEnd={({ data, from, to }) => handleDragEnd({ data, from, to, section: 'Concluido' })}
        />
      </View>
    </ScrollView>
  );
};

export default BoardView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 10,
  },
  scrollContainer: {
    maxHeight: 300, // Limits the height of each scroll container
  },
  pendienteContainer: {
    backgroundColor: 'red', // Red background for the "Pendiente" section
  },
  iniciadoContainer: {
    backgroundColor: 'blue', // Blue background for the "Iniciado" section
  },
  concluidoContainer: {
    backgroundColor: 'green', // Green background for the "Concluido" section
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  taskStatus: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
});
