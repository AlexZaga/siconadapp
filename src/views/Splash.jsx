import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { background_splash, splash_image } from '../../assets/js/globals';
import { getSessionData, saveSessionData } from "../helpers/AStorage";
import { useNavigation, StackActions } from '@react-navigation/native'

export default function Splash({ navigation }) {
  const image = { uri: background_splash }
  const [isUsrLogged, setUsrLogged] = useState(false);

  useEffect(() => {
    getSessionData().then(data => {
      console.log("User Data Stored:");
      console.log(data);
      setUsrLogged(data && "nombre" in data && data["nombre"] !== "");
    }).catch(e => {
      console.log("Error al recuperar datos desde el almacenamiento local");
      console.log(e);
    });
  }, []);

  return (
    <>
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode='cover' style={styles.image}>
          <Image style={styles.tinylogo} source={{ uri: splash_image }} />
          <Text style={styles.mensaje}>Escuela de Negocios</Text>
          <Text style={styles.mensaje}>y</Text>
          <Text style={styles.mensaje}>Desarrollo Empresarial</Text>
          <View>
            {
              !isUsrLogged ? <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('AHJ ENDE'))} style={styles.button}>
                <Text style={styles.buttonText}>Iniciar Sesi&oacute;n</Text>
              </TouchableOpacity> :
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.button}>
                  <Text style={styles.buttonText}>Inicio</Text>
                </TouchableOpacity>
            }</View>
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 10 }}>
            <Text style={styles.version}>&copy;&nbsp;2023 - v1.0.0</Text>
          </View>
          <StatusBar style="auto" hidden={true} />
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  mensaje: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 25
  },
  tinylogo: {
    width: 350,
    height: 380,
  },
  text: {
    color: '#fff'
  },
  spinner: {
    marginTop: 25
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35
  },
  version: {
    color: 'gainsboro',
    fontSize: 12,
    marginTop: 15
  },
  button: {
    backgroundColor: '#009999',
    padding: 10,
    marginTop: 25,
    borderRadius: 10
  },
  buttonText: {
    fontWeight: '400',
    color: '#ffffff'
  }
})
