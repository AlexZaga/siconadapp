import React, { useEffect, useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { user_fem_image, user_male_image, API_BASE_URL, API_PATHS } from '../../assets/js/globals'
import Spinner from "./Spinner"
import { useNavigation, StackActions } from '@react-navigation/native'
import { deleteItem, getSessionData, getTokenData, saveSessionData, saveTokenData } from "../helpers/AStorage"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"

export default function Header() {
    const [sessionInfo, setSessionInfo] = useState({});
    const [loading, setLoading] = useState(false)
    const { dispatch } = useNavigation()

    useEffect(() => {
        getSessionData().then(data => {
            console.log(data.matricula);
            setSessionInfo(data);
        }).catch(err => {
            console.log(`Header EX: ${err}`)
        });
    }, []);

    const logoutUser = async () => {
        setLoading(true);
        const logout_url = API_BASE_URL.concat(API_PATHS.logout);

        const tk = await getTokenData();

        if (!tk){
            alert("Ha ocurrido un error al obtener los datos guardados del usuario.");
            setLoading(true);
            return
        }

        const logoutData = {
            "user": sessionInfo.matricula,
            "password": sessionInfo.orgCorreo
        }

        const headers = {
            "Authorization": `Bearer ${tk}`,
            "Content-Type": "application/json"
        }
        
        const logoutReq = await axios.post(logout_url, logoutData, {headers} );

        console.log(logoutReq.data);

        await deleteItem("token")
        await deleteItem("token_pay");
        await deleteItem("user_session")

        dispatch(StackActions.replace("Bienvenido"));
    }

    if (loading) {
        return (
            <Spinner />
        )
    } else {
        return (
            <SafeAreaView style={{height: 120, marginStart: 12, marginEnd: 12}}>
                <View style={styles.container} >
                    <View>
                        <Image source={{ uri: user_male_image }} style={styles.image} />
                    </View>
                    <View>
                        <Text style={styles.title}>{sessionInfo.nombre}</Text>
                        <Text style={styles.subtitle}>{sessionInfo.matricula}</Text>
                        <Text style={styles.subtitle}>{sessionInfo.planacademico}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttonClose} onPress={logoutUser}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 0,
        justifyContent: "space-around",
        backgroundColor: 'gainsboro',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        padding: 8,
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
        width: "100%"
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "700",
        marginStart: 12,
        marginEnd: 12,
        marginTop: 6,
        marginBottom: 6,
        color: 'gainsboro',
    }
})
