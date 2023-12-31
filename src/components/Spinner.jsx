import React from "react"
import { ActivityIndicator, StyleSheet, View, ImageBackground, Text } from "react-native"
import { ende_image } from "../../assets/js/globals"

export default function Spinner({ mensaje }) {
    
    const image = { uri: ende_image }

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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent"
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
