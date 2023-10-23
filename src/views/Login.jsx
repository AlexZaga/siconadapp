import React, { useState, useEffect } from 'react'
import { ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native'
import Spinner from '../components/Spinner'
import { API_BASE_URL, API_PATHS, background_image, payment_token, usr_token } from '../../assets/js/globals'
import { useNavigation, StackActions } from '@react-navigation/native'
import { saveSessionData, saveTokenData, savePaymentTokenData, deleteItem } from '../helpers/AStorage'
import axios from 'axios'

export default function Home() {
  const [matricula, setMatricula] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { dispatch } = useNavigation()

  useEffect(() => {

  }, []);

  const loginUser = async () => {
    if (!matricula || !password) {
      alert('No es posible continuar con campos vacíos. Verifique, por favor.');
      setMatricula("")
      setPassword("");
      return
    }

    setLoading(true);
    const loginUrl = API_BASE_URL.concat(API_PATHS.login);
    const usrData = {
      "user": matricula,
      "password": password
    }

    try {
      const loginReq = await axios.post(loginUrl, usrData, { "headers": { "Accept": "application/json" } });

      if (loginReq.status !== 200) {
        alert("Ha ocurrido un error al iniciar sesion. Intente de nuevo.");
        setLoading(false);
        return
      }
      const { data } = loginReq.data;

      console.log("Login Data: ");
      console.log(data);

      if (loginReq.data.status !== "200") {
        alert(data.message);
        setLoading(false);
        return
      }


      const sessionStatus = await saveSessionData(data);
      const tokenStatus = await saveTokenData(usr_token);
      const tokenPayStatys = await savePaymentTokenData(payment_token)

      if (!sessionStatus || !tokenStatus || !tokenPayStatys) {
        alert("Ha ocurrido un error al guardar la session de usuario. Intente de nuevo.")
        setLoading(false);
        await deleteItem("token");
        await deleteItem("token_pay");
        await deleteItem("user_session");
        return
      }
      setLoading(false);
      dispatch(StackActions.replace("Dashboard"))
    }catch (error){
      console.log("On error")
      console.log(error);
    }finally {
      setLoading(false);
    }
  }

  //Evaluate State
  if (loading) {
    return (
      <Spinner />
    )
  } else if (!loading) {
    return (
      <ImageBackground source={{ uri: background_image }} style={styles.image}>
        <KeyboardAvoidingView style={{flex: 1}}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={styles.text}>Matr&iacute;cula</Text>
            <TextInput
              id='matricula'
              style={styles.input}
              placeholder="Introduce tu Matricula"
              onChangeText={newText => setMatricula(newText)}
              defaultValue={matricula}
            />
            <Text style={styles.text}>Contrase&ntilde;a</Text>
            <TextInput
              id='pswd'
              style={styles.input}
              placeholder="Introduce tu contraseña"
              onChangeText={newText => setPassword(newText)}
              defaultValue={password}
              secureTextEntry
            />
            <TouchableOpacity onPress={loginUser} style={Platform.OS == "android" ? styles.buttonAND : styles.buttonIOS}>
              <Text style={styles.buttonText}>
                Continuar...
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>

    )
  } else {
    return (
      <View></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center"
    //zIndex: 99
  },
  text: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  input: {
    color: '#000',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(240, 240, 240)'
  },
  form: {
    backgroundColor: '#000000f9',
    display: 'flex',
    flexDirection: 'column',
  },
  buttonAND: {
    margin: 12,
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 5,
    borderWidth: 1,
    borderColor: 'cyan',
    borderRadius: 5
  },
  buttonIOS: {
    margin: 12,
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 12,
    borderWidth: 1,
    borderColor: '#009999',
    borderRadius: 5,
    marginBottom: 0
  },
  buttonText: {
    color: '#009999',
    fontWeight: 'bold',
    fontSize: 15
  }
});
