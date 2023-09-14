import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useRoute } from '@react-navigation/native'
import { APP_API_URL, APP_API_ASIGNATURAS, APP_BEARER_KEY } from '../../assets/js/globals'
import Header from "../components/Header"

export default function Dashboard({ navigation }) {
  const { params: { _nombre, _matricula, _cde, _grupo, _plan, _id, _correo } } = useRoute('Detail')
  const [ _data, setData] = useState([])

  useEffect(() => {
    const asignaturas = async() => {
      try {
        let _url = APP_API_URL().concat(APP_API_ASIGNATURAS() + "/").concat(_plan)
        let _result = await fetch(_url, {
          method: "GET",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            "Authorization": APP_BEARER_KEY()
          }
        })
        let _res = await _result.json()
        setData(_res.data)
        console.log(_data[0].correo)
      } catch (error) {
        setData(error)
        console.log(error)
      }
    }
  
    asignaturas()
  }, [])
  
  return (
    <>
      <View style={styles.container}>
        <Header nombre={_nombre} matricula={_matricula} ID={_id} grupo={_grupo} plan={_plan} correo={_correo} cde={_cde}/>
      </View>
      {
        _data.status === '404'
        ? <View style={styles.subContainer}><Text style={styles.subContainerText}>Informaci&oacute;n no disponible</Text></View>
        : <View style={styles.subContainer}><Text style={styles.subContainerText}>HOLA DKJHKHAKLDHBALJ</Text></View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#009999'
  },
  subContainer: {
    flex: 6,
    backgroundColor: '#009999',
    alignItems: "center"
  },
  subContainerText: {
    color: 'gainsboro',
    fontSize: 20,
    fontWeight: "bold",
  }
})
