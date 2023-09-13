import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, Platform } from 'react-native'
import Spinner from '../components/Spinner'
import { APP_API_URL, APP_API_LOGIN, APP_BEARER_KEY } from '../../assets/js/globals'
import { Storage } from '../components/Storage'
import { useNavigation } from '@react-navigation/native'

export default function Home(){
  const _objStorage = new Storage()
  const [ matricula, setMatricula ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ bgImage ] = useState({ uri: _objStorage.getBackgroundImage() })
  const { navigate } = useNavigation()

  async function handleSubmit() {
    try {
      if(!matricula || !password){
        setLoading(false)
        alert('No es posible continuar con campos vacíos. Verifique, por favor.')
        setMatricula('')
        setPassword('')
      }else{
        setLoading(true)
        let _url = APP_API_URL().concat(APP_API_LOGIN())
        let _result = await fetch(_url, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            "Authorization": APP_BEARER_KEY()
          },
          body: JSON.stringify({
            user: matricula,
            password: password
          })
        })
        let _data = await _result.json()
        if(_data.status !== '404'){
          let _nombre = _data.data.nombre
          let _matricula = _data.data.matricula
          let _cde = _data.data.cde
          let _grupo = _data.data.grupo
          let _plan = _data.data.planacademico
          let _id = _data.data._id
          let _correo = _data.data.orgCorreo
          setLoading(false)
          navigate('Dashboard', {_nombre, _matricula, _cde, _grupo, _plan, _id, _correo})
        }else{
          throw new Error(_data.message)
        }
      }
    } catch (error) {
      setLoading(false)
      alert(error)        
    }finally{
      setMatricula('')
      setPassword('')
    }
  }

  //Evaluate State
  if(loading){
    return (
      <Spinner />
    )
  }else if(!loading){
    return (
      <>
        <View style={styles.container}>
          <ImageBackground source={bgImage} resizeMode="cover" style={styles.image} />
        </View>
        <View style={styles.form}>
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
          {
            Platform.OS === 'ios' && (<TouchableOpacity onPress={handleSubmit} style={styles.buttonIOS}><Text style={styles.buttonText}>Continuar...</Text></TouchableOpacity>)
          }
          {
            Platform.OS === 'android' && (<TouchableOpacity onPress={handleSubmit} style={styles.buttonAND}><Text style={styles.buttonText}>Continuar...</Text></TouchableOpacity>)
          }
        </View>
      </>
    )
  }else{
    return (
      <View></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 99
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
    padding: 5,
    borderWidth: 1,
    borderColor: '#009999',
    borderRadius: 5,
    marginBottom: 30
  },
  buttonText: {
    color: '#009999',
    fontWeight: 'bold',
    fontSize: 15
  }
});
