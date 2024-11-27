import { StyleSheet, Text } from 'react-native';
import React from 'react';

export const Title = ({ text }) => {
  return (
    <Text style={styles.title}>
      {text}
    </Text>
  );
};

export const SubTitle = ({ text }) => {
  return (
    <Text style={styles.subTitle}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18, // Ajustar el tamaño
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: 'center', // Centramos el título
  },
  subTitle: {
    fontSize: 14,
    color: '#555', // Color más suave para los subtítulos
    marginBottom: 2,
  },
});
