import React, { useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { APP_API_URL, APP_API_LOGOUT, APP_BEARER_KEY } from '../../assets/js/globals'
import { Storage } from '../components/Storage'
import { useNavigation } from '@react-navigation/native'

export default function Header({ nombre, matricula, ID, cde, grupo, plan, correo }){
    const [ id ] = useState(ID)
    const [ _nombre ] = useState(nombre)
    const [ _matricula ] = useState(matricula)
    const [ _password ] = useState(correo)
    const [ _cde ] = useState(cde)
    const [ _grupo ] = useState(grupo)
    const [ _plan ] = useState(plan)
    const [ avatarMale ] = useState({uri: new Storage().getAvatarMale()})
    const { navigate } = useNavigation()

    async function handleClose(){
        let _url = APP_API_URL().concat(APP_API_LOGOUT())
        let _result = await fetch(_url, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            "Authorization": APP_BEARER_KEY()
          },
          body: JSON.stringify({
            user: _matricula,
            password: _password
          })
        })
        let _data = await _result.json()
        console.log(_data)
        navigate('Bienvenido')
    }

    return (
        <View style={styles.container}>
            <View>
                <Image source={avatarMale} style={styles.image}/>
            </View>
            <View>
                <Text style={styles.title}>{ _nombre }</Text>
                <Text style={styles.subtitle}>{ _grupo }</Text>
                <Text style={styles.subtitle}>{ _cde }</Text>
            </View>
            <View>
                <TouchableOpacity style={styles.buttonClose} onPress={handleClose}>
                    <Text style={styles.buttonText}>Terminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 55,
        justifyContent: "space-around",
        backgroundColor: 'gainsboro',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        padding: 6,
    },
    leftContainer: {
        flex: 1,
        alignItems: "flex-start"
    },
    rightContainer: {
        flex: 1,
        alignItems: "flex-end"
    },
    title: {
        fontSize: 14,
        color: '#000'
    },
    subtitle: {
        fontSize: 11,
        color: '#000'
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 30,
    },
    buttonClose: {
        padding: 5,
        borderRadius: 7,
        backgroundColor: '#009999',
        borderWidth: 1,
        borderColor: '#000'
    },
    buttonText: {
        fontSize: 13,
        fontWeight: "700",
        color: 'gainsboro',

    }
})
