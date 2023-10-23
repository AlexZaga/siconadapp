import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity, Image } from "react-native";
import Header from "../components/Header"
import { background_splash } from "../../assets/js/globals";
import NewsTable from "../components/News/NewsTable";
import SubjectsTable from "../components/Subjects/SubjectsTable";
import PaymentsTable from "../components/Payments/PaymentsTable";

const defaultTabs = [
  {
    "id": 1,
    "title": "Asignaturas",
    "image": require("../../assets/closed_book.png")
  },
  {
    "id": 2,
    "title": "Calendario De Pagos",
    "image": require("../../assets/calendar.png")
  },
  {
    "id": 3,
    "title": "Comunicados Presidencia",
    "image": require("../../assets/news.png")
  }
]

export default function Dashboard() {
  const [dashboardTabs, setDashboardTabs] = useState(defaultTabs)


  const [tabSelected, setTabSelected] = useState(3);

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View
        style={styles.cardImageHolder}>
        <ImageBackground
          source={{ uri: background_splash }}
          imageStyle={{ borderRadius: 12 }}
          style={styles.cardBackground}
          resizeMode="cover">
          {
            dashboardTabs.map(t => {
              return (
                <TouchableOpacity key={t.id} onPress={() => { setTabSelected(t.id) }} activeOpacity={0.5} style={styles.cardButton}>
                  <Image
                    source={t.image}
                    style={styles.imageButton}
                  />
                  <Text style={styles.textButton}>{t.title}</Text>
                </TouchableOpacity>
              )
            })
          }
        </ImageBackground>
        <View style={{ flex: 1, justifyContent:"center", alignItems: "center" }}>
          {
            tabSelected === 3 ? <NewsTable /> : tabSelected === 1 ? <SubjectsTable /> : <PaymentsTable />
          }
        </View>
      </View>
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
    backgroundColor: "white",
    width: "75%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
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
