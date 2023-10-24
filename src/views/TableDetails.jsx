import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground, ScrollView, FlatList, TouchableOpacity, Image } from "react-native";
import Header from "../components/Header";
import { useNavigation, StackActions } from '@react-navigation/native'
import SubjectsDataTable from "../components/TableDetails/SubjectsData";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NewsDataTable from "../components/TableDetails/NewsData";


export default function TableDetails({ route: { params: { component_to_render } }}) {
    //const [dashboardTabs, setDashboardTabs] = useState(defaultTabs)
    //const [tabSelected, setTabSelected] = useState(1);
    const { dispatch } = useNavigation()

    useEffect(() => {
        console.log(component_to_render);
    }, []);
    

    return (
        <ScrollView style={styles.container}>
            <Header />
            <GestureHandlerRootView>
                {
                    component_to_render === "subjects" ? <SubjectsDataTable /> : 
                        component_to_render === "news" ? <NewsDataTable /> : null
                }
            </GestureHandlerRootView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
