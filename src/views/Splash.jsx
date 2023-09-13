import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';

export default function Splash({ navigation }) {
  const image = {uri: 'https://res.cloudinary.com/interprocsysmex/image/upload/v1673676986/ahjende/blognoticias/Blog-Noticias-img_noTexto_zjqkzb.png'}

  return (
    <>
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode='cover' style={styles.image}>
          <Image style={styles.tinylogo} source={{ uri: 'https://res.cloudinary.com/interprocsysmex/image/upload/v1674512758/ahjende/landpage/Logo_Sin_Texto_sdcvcf.png' }} />
          <Text style={styles.mensaje}>Escuela de Negocios</Text>
          <Text style={styles.mensaje}>y</Text>
          <Text style={styles.mensaje}>Desarrollo Empresarial</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AHJ ENDE')} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Sesi&oacute;n</Text>
          </TouchableOpacity>
          <View style={{display: 'flex', flexDirection: 'column', alignItems:'flex-end', marginTop: 10 }}>
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
  button : {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'blue'
  },
  text : {
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
  version : {
    color: 'gainsboro',
    fontSize: 12,
    marginTop: 15
  },
  button: {
    backgroundColor: '#009999',
    padding: 10,
    marginTop: 25,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: '400',
    color: '#ffffff'

  }
})
