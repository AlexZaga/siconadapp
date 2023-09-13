import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRoute } from '@react-navigation/native'
import Header from "../components/Header"

export default function Dashboard({ navigation }) {
  const { params: { _nombre, _matricula, _cde, _grupo, _plan, _id, _correo } } = useRoute('Detail')

  return (
    <>
      <View style={styles.container}>
        <Header nombre={_nombre} matricula={_matricula} ID={_id} grupo={_grupo} plan={_plan} correo={_correo} cde={_cde}/>
        <View>
          <Text>Esta es la onda</Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#009999'
  }
})
