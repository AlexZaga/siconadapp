import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground, ScrollView, FlatList, TouchableOpacity, Image } from "react-native";
import Header from "../components/Header";
import { useNavigation, StackActions } from '@react-navigation/native'
import SubjectsDataTable from "../components/TableDetails/SubjectsData";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NewsDataTable from "../components/TableDetails/NewsData";
import PaymentsDataTable from "../components/TableDetails/PaymentsData";
import { useStateContext } from "../helpers/Context";
import AccStatusDataTable from "../components/TableDetails/AccStatusData";


export default function TableDetails({ route: { params: { component_to_render } }}) {
    //const [dashboardTabs, setDashboardTabs] = useState(defaultTabs)
    //const [tabSelected, setTabSelected] = useState(1);
    //const { dispatch } = useNavigation()
    const { state, dispatch } = useStateContext();

    useEffect(() => {
        console.log(component_to_render); 
        dispatch({ type: "TOOGLE_BUTTON" })
    }, []);
    
    

    return (
        <View style={styles.container}>
            <Header />
            <GestureHandlerRootView>
                {
                    component_to_render === "subjects" ? <SubjectsDataTable /> : 
                    component_to_render === "news" ? <NewsDataTable /> : 
                    component_to_render === "payments" ? <PaymentsDataTable /> : 
                    component_to_render === "acc_status" ? <AccStatusDataTable /> : null
                }
            </GestureHandlerRootView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
