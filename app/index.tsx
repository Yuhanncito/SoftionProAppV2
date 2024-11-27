import React from 'react'
import { Modal, Portal, Provider } from 'react-native-paper'
import { StatusBar } from 'react-native';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASEURL } from '../api/index';
import { router } from 'expo-router';

const index = () => {

  interface UserSchema {
    email: string;
    password: string;
  }

  const [user, setUser] = useState<UserSchema>({
    email: '',
    password: '',
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [count, setCount] = useState(3);
  const [countIntent, setCountIntent] = useState(1);



  const [visible, setVisible] = useState(false); // Controla el modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal
  const [modalTitle, setModalTitle] = useState(''); 

  const showModal = (title: any, message:any) => {
    setModalTitle(title);
    setModalMessage(message);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const loginFunction = async () => {
    if (user.email && user.password) {
      setIsSubmitting(true);
      try {
        const res = await fetch(`${BASEURL}/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        const json = await res.json();

        if (json.message === 'correcto' || json.message === 'Tienes un Código Activo') {
          showModal('Inicio de sesión exitoso', json.message);
          setTimeout(() => {
            router.push({
              pathname: '/verify-email',
              params: { email: user.email, option: 'Login' },
            });            
            hideModal();
          }, 2000); // Navega a la pantalla 'VerifyEmail' tras 2 segundos
        } else {
          showModal('Error', `${json.message} \nTienes ${count} intentos restantes`);
          setCount(count - 1);
        }
      } catch (err) {
        showModal('Error', `Error interno: ${err}`);
      } finally {
        setIsSubmitting(false);
      }

      if (count === 0 && countIntent < 4) {
        setIsSubmitting(true);
        showModal('Bloqueo temporal', `Se te ha bloqueado por ${countIntent * 12} segundos.`);

        setTimeout(() => {
          setCount(3);
          setCountIntent(prevIntent => prevIntent + 1);

          setIsSubmitting(false);
          showModal('Desbloqueado', 'Ya puedes intentar nuevamente.');
        }, countIntent * 12 * 1000);
      }

    } else {
      showModal('Error', 'Por favor, complete todos los campos');
    }
    
  };

  return (
    <Provider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>{modalTitle}</Text>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.blueBackground}>
          <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
            <Text style={styles.title}>Inicie sesión con su cuenta</Text>
            <Text style={styles.subtitle}>Introduce tu email y contraseña para iniciar sesión</Text>
          </View>

          <View style={styles.whiteBox}>

 

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo</Text>
              <TextInput
                style={styles.input}
                placeholder="Correo"
                value={user.email}
                onChangeText={value => setUser(prev => ({ ...prev, email: value }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Contraseña"
                  value={user.password}
                  onChangeText={value => setUser(prev => ({ ...prev, password: value }))}
                  secureTextEntry={secureTextEntry}
                />
                <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                  <Icon
                    name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="gray"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>





            <TouchableOpacity style={styles.forgotPassword} >
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}  disabled={isSubmitting} onPress={loginFunction}>
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text>No tienes una cuenta? </Text>
              <TouchableOpacity>
                <Text style={styles.link}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>

          <StatusBar barStyle="dark-content" />
          
        </View>
      </ScrollView>
    </Provider>
  )
}

export default index

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1, 
    backgroundColor: '#fff',
  },
  blueBackground: {
    width: width,
    height: height * 0.4,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  whiteBox: {
    position: 'absolute',
    top: height * 0.32,
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  icon: {
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  link: {
    color: '#0066cc',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%', // Ajusta el ancho al 80% de la pantalla
    alignSelf: 'center', // Centra el modal en la pantalla
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

import { Button } from 'react-native';

export const Longinn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <Text>Longinnn</Text>

      <Text>Correo electrónicoc</Text>
      <TextInput
        placeholder="Ingrese su correoo"
        value={email}
        onChangeText={setEmail}
        testID="email-input"
      />

      <Text>Contraseñaa</Text>
      <TextInput
        placeholder="Ingrese su contraseñaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
      />

      <Button
        title="Iniciar Sesiónn"
        onPress={() => console.log('Iniciar sesión')}
        testID="login-button"
      />
    </View>
  );
};

