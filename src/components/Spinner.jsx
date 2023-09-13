import React from "react"
import { ActivityIndicator, StyleSheet, View, ImageBackground, Text } from "react-native"
import { Storage } from '../components/Storage'

export default function Spinner({ mensaje }) {
    const _objStorage = new Storage()
    const image = { uri: _objStorage.getImageENDE()}

    return (
        <View style={styles.container}>
            <ImageBackground source={image} style={styles.image} />
            <Text style={styles.processText}>Procesando...</Text>
            <ActivityIndicator size='large' color="#0000ff"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "gainsboro"
    },
    processText: {
        fontSize: 35,
        fontWeight: "300",
        marginBottom: 15,
    },
    image: {
        width: 100,
        height: 100,
    },
})
