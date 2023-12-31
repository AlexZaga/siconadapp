import React, { useEffect, useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { user_fem_image, user_male_image, API_BASE_URL, API_PATHS } from '../../assets/js/globals'
import { useNavigation, StackActions } from '@react-navigation/native'
import { deleteItem, getSessionData, getTokenData, getItem } from "../helpers/AStorage"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"
import { useStateContext } from "../helpers/Context"
import { ActivityIndicator } from "react-native-paper"

export default function Header() {
    const [sessionInfo, setSessionInfo] = useState({});
    const [loading, setLoading] = useState(false)
    const navDispatch = useNavigation().dispatch
    const { state, dispatch } = useStateContext();


    useEffect(() => {
        getSessionData().then(data => {
            if (data["matricula"]){
                console.log("Estudiante")
                //Estudiante
                setSessionInfo({
                    "user_name": data["nombre"],
                    "user_id": data["matricula"],
                    "extra": data["planacademico"],
                    "orgCorreo": data["orgCorreo"],
                    "type": "student"
                });
            }else {
                console.log("Administrativo")
                setSessionInfo({
                    "user_name": data["orgNombre"],
                    "user_id": data["orgCorreo"],
                    "extra": data["orgNivelDescripcion"],
                    "type": data["orgNivel"]
                });
            }
            console.log(data);
            //setSessionInfo(data);
        }).catch(err => {
            console.log(`Header EX: ${err}`)
        });
    }, []);

    useEffect(() => {
        console.log("Header session data:");
        console.log(sessionInfo)
    }, [sessionInfo]);

    const logoutUser = async () => {
        setLoading(true);
        const logout_url = API_BASE_URL.concat(API_PATHS.logout);

        const tk = await getTokenData();

        if (!tk) {
            alert("Ha ocurrido un error al obtener los datos guardados del usuario.");
            setLoading(true);
            return
        }

        var logoutData = {}

        if (sessionInfo["type"] === "student"){
            logoutData = {
                "user": sessionInfo["user_id"],
                "password": sessionInfo["orgCorreo"]
            }
        }else {
            const adminTk = await getItem("adminToken");
            logoutData = {
                "tokenhash": adminTk
            }
        }

        const headers = {
            "Authorization": `Bearer ${tk}`,
            "Content-Type": "application/json"
        }

        const logoutReq = await axios.post(logout_url, logoutData, { headers });

        console.log(logoutReq.data);

        await deleteItem("token")
        await deleteItem("token_pay");
        await deleteItem("user_session")
        if (sessionInfo["type"] !== "student") {
            await deleteItem("adminToken")
        }

        navDispatch(StackActions.replace("Bienvenido"));
    }

    const handleBack = () => {
        navDispatch(StackActions.pop(1));
        dispatch({ type: "TOOGLE_BUTTON" })
    }

    return (
        <SafeAreaView style={{ marginTop: 12, marginBottom: 12, marginEnd: 8, marginStart: 8 }}>
            <View style={styles.container} >
                {
                    state.showBackButton ?
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}
                            onPress={handleBack}>
                            <Image source={require("../../assets/back.png")} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity> : null
                }
                <View style={{ margin: !state.showBackButton ? 12 : 0 }}>
                    <Image source={{ uri: user_male_image }} style={styles.image} />
                </View>
                <View>
                    <Text style={styles.title}>{sessionInfo.user_name}</Text>
                    <Text style={styles.subtitle}>{sessionInfo.user_id}</Text>
                    <Text style={styles.subtitle}>{sessionInfo.extra}</Text>
                </View>
                <View>
                    {
                        loading ? <ActivityIndicator size="small" color="#0000ff" /> :
                            <TouchableOpacity style={styles.buttonClose} onPress={logoutUser}>
                                <Text style={styles.buttonText}>Cerrar</Text>
                            </TouchableOpacity>
                    }

                </View>
            </View>
        </SafeAreaView>
    )
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
        paddingTop: 8,
        paddingBottom: 8
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
        width: 38,
        height: 38,
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
