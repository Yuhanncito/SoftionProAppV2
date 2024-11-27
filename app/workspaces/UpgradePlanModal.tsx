// components/payments/UpgradePlanModal.js

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const UpgradePlanModal = ({ visible, onClose }) => {
  const router = useRouter();

  const navigateToPayment = () => {
    onClose();
    router.push('/workspaces/PaymentModal'); // Ajusta la ruta según la estructura exacta
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon name="ribbon-outline" size={50} color="#007AFF" style={styles.logo} />
          <Text style={styles.modalTitle}>Actualización de Plan</Text>
          <Text style={styles.planDescription}>
            Cámbiate al plan básico por solo 20 pesos al mes y obtén espacios ilimitados.
          </Text>
          <Text style={styles.priceText}>$20 MXN / mes</Text>

          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>✓ Almacenamiento ilimitado</Text>
            <Text style={styles.benefitItem}>✓ Carpetas y espacios ilimitados</Text>
            <Text style={styles.benefitItem}>✓ Campos personalizados ilimitados</Text>
          </View>

          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={navigateToPayment}
          >
            <Text style={styles.upgradeButtonText}>Elegir Básico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UpgradePlanModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  benefitsList: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  benefitItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
