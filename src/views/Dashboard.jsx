import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ImageBackground, ScrollView, FlatList, TouchableOpacity, Image } from "react-native";
import Header from "../components/Header"
import { background_splash } from "../../assets/js/globals";
import NewsTable from "../components/News/NewsTable";
import SubjectsTable from "../components/Subjects/SubjectsTable";
import PaymentsTable from "../components/Payments/PaymentsTable";
import AccountStatusTable from "../components/AccountStatus/AccountTable";

const defaultTabs = [
  {
    "id": 1,
    "title": "Estado De Cuenta",
    "image": require("../../assets/account.png")
  },
  {
    "id": 2,
    "title": "Asignaturas",
    "image": require("../../assets/closed_book.png")
  },
  {
    "id": 3,
    "title": "Calendario De Pagos",
    "image": require("../../assets/calendar.png")
  },
  {
    "id": 4,
    "title": "Comunicados Presidencia",
    "image": require("../../assets/news.png")
  }
]

export default function Dashboard() {
  const [dashboardTabs, setDashboardTabs] = useState(defaultTabs)
  const [tabSelected, setTabSelected] = useState(1);

  const TabItem = ({t}) => {
    return (
      <TouchableOpacity key={t.id} onPress={() => { setTabSelected(t.id) }} activeOpacity={0.5} style={styles.cardButton}>
        <Image
          source={t.image}
          style={styles.imageButton}
        />
        <Text adjustsFontSizeToFit style={styles.textButton}>{t.title}</Text>
      </TouchableOpacity>
    )
  }

  function mapTabComponents(){
    if(tabSelected === 1){
      return <AccountStatusTable />;
    }else if (tabSelected === 2){
      return <SubjectsTable />
    }else if (tabSelected === 3){
      return <PaymentsTable />
    }else if (tabSelected === 4){
      return <NewsTable />
    }
  }

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

          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: "100%"
            }}>
            <FlatList
              data={dashboardTabs}
              renderItem={({item}) => <TabItem t={item} /> }
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              numColumns={dashboardTabs.length / 2}
            />
          </ScrollView>
          
        </ImageBackground>
        <View style={{ flex: 1, justifyContent:"center", alignItems: "center" }}>
          {
            mapTabComponents()
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
