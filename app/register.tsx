import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importa el ícono adecuado
import { useForm } from 'react-hook-form'; // Para validar el formulario
import { RegisterFunction } from '../api'; // Función de registro
import { SelectList } from 'react-native-dropdown-select-list'; // Importa Dropdown Select List
import { useLocalSearchParams, router } from 'expo-router';
import { useRouter } from 'expo-router';

/**
 * Pantalla de registro de usuario
 * 
 * Contiene un formulario con los siguientes campos:
 * - Nombre
 * - Apellidos
 * - Correo electrónico
 * - Contraseña
 * - Confirmar contraseña
 * - Pregunta de seguridad
 * - Respuesta de seguridad
 * 
 * Al presionar el botón "Registrar", se validarán los campos y se
 * realizará la petición de registro a la API.
 * 
 * Si el registro es exitoso, se navegará a la pantalla de verificación de
 * correo electrónico.
 * 
 * En caso de error, se mostrará un mensaje de error.
 * 
 * Los campos de contraseña y confirmar contraseña se pueden mostrar o
 * ocultar con un botón con un icono de ojo.
 * 
 * La pregunta de seguridad se muestra como un dropdown con las opciones
 * "colorFavorito", "nombreMascota", "ciudadNacimiento" y "comidaFavorita".
 * La respuesta de seguridad se ingresa en un campo de texto.
 * 
 * El botón "Cancelar" permite regresar a la pantalla anterior.
 * 
 * La pantalla también contiene un enlace para navegar a la pantalla de
 * inicio de sesión.
 */
const Register = () => {

  /**
   * Esquema del usuario
   */
  interface UserSchema {
    name: string;
    lastName: string;
    email: string;
    password: string;
    password2: string;
    secret: string;
    respuestaSecreta: string;
  }

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);
  const { register, handleSubmit: handleValidateSubmit, formState: { errors } } = useForm();
  const [user, setUser] = useState<UserSchema>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    secret: '',
    respuestaSecreta: '',
  });

  

  // Opciones para la pregunta de seguridad
  const questions = [
    {
      key: "colorFavorito",
      value: "¿Cuál es tu color favorito?",
    },
    {
      key: "nombreMascota",
      value: "¿Cómo se llama tu primera mascota?",
    },
    {
      key: "ciudadNacimiento",
      value: "¿En qué ciudad naciste?",
    },
    {
      key: "comidaFavorita",
      value: "¿Cuál es tu comida favorita?",
    },
  ];

  // Validación del formulario y registro del usuario
  const handleSubmit = async () => {
    try {
      if (user?.password !== user?.password2) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
  
      const res = await RegisterFunction(user);
  
      if (res.success) {
        Alert.alert('Registro exitoso', res.data.message || 'Registro completado con éxito');
        router.push('/verify-email');
        router.setParams({ ...user, option: 'register' });
      } else {
        Alert.alert('Error', res.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado. Inténtalo nuevamente.');
      console.error(error); // Ayuda para depuración en consola
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.whiteBox}>
          {/* Formulario de registro */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduce tu nombre"
              value={user?.name}
              keyboardType='default'
              onChangeText={value => setUser({ ...user, name: value })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellidos</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduce tus apellidos"
              value={user.lastName}
              onChangeText={text => setUser({ ...user, lastName: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduce tu correo electrónico"
              value={user.email}
              onChangeText={text => setUser({ ...user, email: text })}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                value={user.password}
                onChangeText={text => setUser({ ...user, password: text })}
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmar contraseña"
                value={user.password2}
                onChangeText={text => setUser({ ...user, password2: text })}
                secureTextEntry={secureTextEntry2}
              />
              <TouchableOpacity onPress={() => setSecureTextEntry2(!secureTextEntry2)}>
                <Icon
                  name={secureTextEntry2 ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="gray"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dropdown de pregunta de seguridad con react-native-dropdown-select-list */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pregunta de seguridad</Text>
            <SelectList
              data={questions}
              setSelected={(itemValue:any) => setUser({ ...user, secret: itemValue })}
              placeholder="Selecciona tu pregunta"
              search={false}
              boxStyles={styles.picker} // Estilo personalizado para el dropdown
            />
          </View>
{
  // 
}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Respuesta de seguridad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu respuesta"
              value={user.respuestaSecreta}
              onChangeText={text => setUser({ ...user, respuestaSecreta: text })}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={handleValidateSubmit(handleSubmit)}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.link}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50, // Para que el contenido no se quede oculto
  },
  whiteBox: {
    marginTop: 20,
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
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
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
  link: {
    color: '#0066cc',
  },
});

export default Register;


import { Button } from 'react-native';

export const Registerrr = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <Text>Register</Text>

      <Text>Nombre de usuarioo</Text>
      <TextInput
        placeholder="Ingrese su nombre de usuarioo"
        value={username}
        onChangeText={setUsername}
      />

      <Text>Correoo electrónicoc</Text>
      <TextInput
        placeholder="Ingrese su correoo"
        value={email}
        onChangeText={setEmail}
      />

      <Text>Contraseñaa</Text>
      <TextInput
        placeholder="Ingrese su contraseñaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Registrarsee" onPress={() => console.log('Registro iniciado')} />
    </View>
  );
};
