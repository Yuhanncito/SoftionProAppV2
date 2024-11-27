import { StyleSheet, View } from 'react-native';
import { SubTitle } from '../atomos/atomo_card';
import React from 'react';

const MoleculaCard = ({ proyects, participates, propietary, userLogged }) => {
  const propietaryName = 'Gize Yuhann Martinez';
  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <SubTitle text={`Proyectos: ${proyects}`} />
        <SubTitle text={`Participantes: ${participates}`} />
      </View>
      <SubTitle
        text={propietary === userLogged ? 'Dueño' : 'Participante'}
        style={[styles.statusText, { color: propietary === propietaryName ? '#007AFF' : '#888' }]}
      />
    </View>
  );
};

export default MoleculaCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginVertical: 8, // Mayor espacio vertical
  },
  detailsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'right', // Alineamos el texto a la derecha para mejor distribución
  },
});
