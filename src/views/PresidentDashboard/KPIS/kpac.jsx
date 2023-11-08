import react, {useEffect, useState} from "react";
import { StyleSheet, Text, ScrollView, View, Dimensions } from "react-native";
import * as pac_data from "../../../../assets/mocks/pac.json";
import { BarChart, PieChart } from "react-native-chart-kit";


const KPI_PAC = () => {
    const [infoInformes, setInfoInformes] = useState([]);
    const [infoCitados, setInfoCitados] = useState([]);
    const [infoEntrevistados, setInfoEntrevistados] = useState([]);

    const chartConfig = {
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        barPercentage: 0.5,
    };

    useEffect(() => {
        // Fetch de datos
        const infoData = pac_data["informe"];
        const informes_data = infoData.map((i) => {
            return {
                "name": `${i.cde} - ${i.informedatos}`,
                "informes": i.informedatos,
                "legendFontSize": 12,
                "color": i.cde === "CUAU" ? "#3e8bf0" : 
                    i.cde === "NAUCA" ? "#3e8ba0" : i.cde === "PAC" ? "#67e09b" :
                        i.cde === "ECA" ? "#ffe478" : i.cde === "QRO" ? "#725ecc" : "#ff5563"
            }
        });

        const citados_data = infoData.map((i) => {
            return {
                "name": `${i.cde} - ${i.citadosdata}`,
                "citados": i.citadosdata,
                "legendFontSize": 12,
                "color": i.cde === "CUAU" ? "#3e8bf0" :
                    i.cde === "NAUCA" ? "#3e8ba0" : i.cde === "PAC" ? "#67e09b" :
                        i.cde === "ECA" ? "#ffe478" : i.cde === "QRO" ? "#725ecc" : "#ff5563"
            }
        });

        const entrevistados_data = infoData.map((i) => {
            return {
                "name": `${i.cde} - ${i.entrevistadata}`,
                "entrevistados": i.entrevistadata,
                "legendFontSize": 12,
                "color": i.cde === "CUAU" ? "#3e8bf0" :
                    i.cde === "NAUCA" ? "#3e8ba0" : i.cde === "PAC" ? "#67e09b" :
                        i.cde === "ECA" ? "#ffe478" : i.cde === "QRO" ? "#725ecc" : "#ff5563"
            }
        });

        setInfoInformes(informes_data);
        setInfoCitados(citados_data);
        setInfoEntrevistados(entrevistados_data);

    }, []);


    return (
        <ScrollView style={{ flex: 1, margin: 12 }}>
            <View style={{ }}>
                <Text style={styles.headerText}>Informes</Text>
                <View style={styles.divisor} />
                <PieChart
                    data={infoInformes}
                    width={Dimensions.get("window").width}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"informes"}
                    backgroundColor={"transparent"}
                />
                <Text style={styles.headerText}>Citados</Text>
                <View style={styles.divisor} />
                <PieChart
                    data={infoCitados}
                    width={Dimensions.get("window").width}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"citados"}
                    backgroundColor={"transparent"}
                />
                <Text style={styles.headerText}>Entrevistados</Text>
                <View style={styles.divisor} />
                <PieChart
                    data={infoEntrevistados}
                    width={Dimensions.get("window").width}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"entrevistados"}
                    backgroundColor={"transparent"}
                />
            </View>
        </ScrollView>
    )
}

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
        height: 4,
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

export default KPI_PAC;