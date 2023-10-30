import React, { useEffect, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Dimensions } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from "../../components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import KPI_PAC from "./KPIS/kpac";

const KPI_CITAS = () => {
    return (
        <ScrollView style={{ flex: 1, margin: 12 }}>
            <Text style={styles.headerText}>Citas</Text>
            <View style={styles.divisor} />
        </ScrollView>
    )
}

const KPI_REFS = () => {
    return (
        <ScrollView style={{ flex: 1, margin: 12 }}>
            <Text style={styles.headerText}>Registros y Referidos</Text>
            <View style={styles.divisor} />
        </ScrollView>
    )
}

const KPI_LIKES = () => {
    return (
        <ScrollView style={{ flex: 1, margin: 12 }}>
            <Text style={styles.headerText}>Likes</Text>
            <View style={styles.divisor} />
        </ScrollView>
    )
}

const PresDashboard = () => {
    const Tab = createBottomTabNavigator();


    useEffect(() => {

    }, []);


    return (
        <View style={styles.container}>
            <Header />
            <NavigationContainer independent={true}>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            if (route.name === 'PAC') {
                                iconName = focused ? 'ios-analytics' : 'ios-analytics-outline';
                            } else if (route.name === 'CITAS') {
                                iconName = focused ? 'ios-aperture' : 'ios-aperture-outline';
                            } else if (route.name === 'REG Y REF') {
                                iconName = focused ? 'ios-bar-chart' : 'ios-bar-chart-outline';
                            } else if (route.name === 'LIKES') {
                                iconName = focused ? 'ios-leaf' : 'ios-leaf-outline';
                            }
                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: 'tomato',
                        tabBarInactiveTintColor: 'gray',
                        headerShown: false
                    })}
                >
                    <Tab.Screen name="PAC" component={KPI_PAC} />
                    <Tab.Screen name="CITAS" component={KPI_CITAS} />
                    <Tab.Screen name="REG Y REF" component={KPI_REFS} />
                    <Tab.Screen name="LIKES" component={KPI_LIKES} />
                </Tab.Navigator>
            </NavigationContainer>
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerText: {
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 12
    },
    divisor: {
        backgroundColor: "#0092b7",
        height: "2%",
        width: "40%"
    },
    cardImageHolder: {
        flex: 1,
        marginStart: 12,
        marginEnd: 12
    },
    cardBackground: {
        justifyContent: "center",
        alignItems: "center",
        padding: 12
    },
    cardButton: {
        flex: 1,
        backgroundColor: "white",
        //width: "30%",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        margin: 12
    },
    imageButton: {
        tintColor: "#0092b7",
        width: 42,
        height: 42
    },
    textButton: {
        color: "#0092b7",
        fontSize: 18,
        textAlign: "center",
        padding: 8
    }
})

export default PresDashboard;