import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Title } from '../atomos/atomo_card';
import MoleculaCard from '../moleculas/molecula_card';
import React from 'react';
import { router } from 'expo-router'; // Importar para la navegación

const OrganismoCard = ({ workspace, userLogged }) => {
  const handlePress = () => {
    // Navegar al detalle del WorkSpace
    router.push(`/workspaces/${workspace._id}`);
  };


  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.titleContainer}>
        <Title text={`WorkSpace de ${workspace.propetaryUser.name}`} />
      </View>
      <MoleculaCard
        proyects={workspace.projects.length}
        participates={workspace.participates.length}
        propietary={workspace.propetaryUser.email}
        userLogged={userLogged}
      />
    </TouchableOpacity>
  );
};

export default OrganismoCard;

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Sombra más suave
    shadowRadius: 3.84,
    elevation: 4,
    backgroundColor: '#fff',
    borderRadius: 15, // Redondeo de esquinas
    padding: 18, // Menos padding interno
    marginBottom: 20, // Mayor espacio entre tarjetas
    width: '100%',
    alignSelf: 'center', // Centrar la tarjeta
    alignItems: 'center', // Centramos los elementos dentro de la tarjeta
  },
  titleContainer: {
    marginBottom: 12,
    alignItems: 'center', // Centramos el título
  },
});
