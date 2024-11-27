import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendInvitation, getWorkSpacesById } from '@/api';
import { useLocalSearchParams } from 'expo-router';

const InviteUserScreen = () => {
  const { workspaceId } = useLocalSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [Workspace, setWorkspace] = useState(null);
  const [participants, setParticipants] = useState([]);

  const fetchWorkspaceData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const workspaces = await getWorkSpacesById(token, workspaceId);
      console.log("Workspace data:", workspaces); // Verifica la estructura del objeto
      setWorkspace(workspaces);
      setParticipants(workspaces.participates || []); // Asegura que 'participates' esté definido
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al obtener los datos del workspace');
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación');
        return;
      }
      const data = {
        workSpace: workspaceId,
        email,
      };
      const result = await sendInvitation(token, data);

      if (result.message === 'Invitación enviada correctamente') {
        Alert.alert('Éxito', 'Invitación enviada correctamente');
        setEmail('');
        fetchWorkspaceData();
      } else {
        Alert.alert('Error', result.message || 'No se pudo enviar la invitación');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Ocurrió un error al enviar la invitación');
    }
  };

  const renderParticipant = ({ item }) => (
    <View style={styles.participantCard}>
      <Icon name="person-circle-outline" size={40} color="#555" />
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>
          {item.user?.name || "Sin Nombre"} {item.user?.lastName || ""}
        </Text>
        <Text style={styles.participantEmail}>
          {item.user?.email || "Sin Correo"}
        </Text>
      </View>
      <TouchableOpacity>
        <Icon name="close-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          WorkSpace de {Workspace?.propetaryUser?.name || "Propietario Desconocido"}
        </Text>
      </View>

      <View style={styles.inviteContainer}>
        <Text style={styles.inviteTitle}>Invitar Usuario</Text>
        <Text style={styles.inviteSubtitle}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@correo.com"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
          <Text style={styles.inviteButtonText}>Invitar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.participantsTitle}>Participantes</Text>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.user?._id || item.id}
        renderItem={renderParticipant}
        contentContainerStyle={styles.participantsList}
      />
    </SafeAreaView>
  );
};

export default InviteUserScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  inviteContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inviteSubtitle: {
    fontSize: 15,
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#555',
  },
  inviteButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  participantsList: {
    paddingBottom: 20,
    marginHorizontal: 20,
  },
  participantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  participantInfo: {
    flex: 1,
    marginLeft: 10,
  },
  participantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  participantEmail: {
    fontSize: 14,
    color: '#555',
  },
});
