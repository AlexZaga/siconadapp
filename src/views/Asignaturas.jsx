import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { APP_API_URL, APP_API_ASIGNATURAS, APP_BEARER_KEY } from '../../assets/js/globals'
import Header from "../components/Header"

export default function Asignaturas({ nombre, matricula, cde, grupo, plan, correo }) {
    let _nombre = nombre
    let _matricula = matricula
    let _cde = cde
    let _grupo = grupo
    let _plan = plan
    let _correo = correo
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
                <Header nombre={_nombre} matricula={_matricula} grupo={_grupo} correo={_correo} cde={_cde} plan={_plan}/>
            </View>
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
