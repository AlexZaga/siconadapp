import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import { API_PATHS, API_PAYMENT_BASE_URL } from "../../../assets/js/globals";
import axios from "axios"
import { getPaymentTokenData, getSessionData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";

const PaymentsTable = () => {
    const [paymentsData, setPaymentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const sortDates = (a, b) => {
        var d1 = new Date(a.fecha)
        var d2 = new Date(b.fecha);
        if (d1 > d2) {
            return -1
        } else if (d1 < d2) {
            return 1
        }
        return 0
    }

    const fetchPayments = async () => {
        try {
            const token = await getPaymentTokenData();
            const userInfo = await getSessionData()
            const payments_url = API_PAYMENT_BASE_URL.concat(API_PATHS.payments).concat(userInfo["matricula"]);
            var payReq = await axios.get(payments_url, { headers: { "Authorization": `Bearer ${token}` } })
            return payReq;
        } catch (ex) {
            console.log(ex);
            return null;
        }
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const paymentsData = await fetchPayments();
            if (paymentsData.status === 200) {
                const sortedPayments = paymentsData.data.data.sort(sortDates).slice(0, 3);
                setPaymentsData(sortedPayments);
            }
            setIsLoading(false);
        })();
        console.log("Loaded Data from Payments");
    }, []);

    const Item = ({ paymentData }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.listButton}>
                <View style={{ flexDirection: "column", flexGrow: 1 }}>
                    <Text style={{ flex: 1, fontSize: 18 }}>{paymentData.concepto}</Text>
                    <Text style={{ flex: 1, fontSize: 12 }}>{paymentData.fecha} - {paymentData.estatusPago}</Text>
                </View>
                <Image source={require("../../../assets/info.png")} style={{ tintColor: "gray", width: 28, height: 28 }} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Calendario de Pagos</Text>
            <View style={styles.divisor} />
            {
                isLoading ?
                    <Spinner /> :
                    <>
                        <FlatList
                            ItemSeparatorComponent={<View style={{ height: "3%", backgroundColor: "gray" }} />}
                            scrollEnabled={false}
                            style={{ height: 180 }}
                            data={paymentsData}
                            renderItem={({ item }) => <Item paymentData={item} />}
                            keyExtractor={item => item._id}
                        />
                        <TouchableOpacity style={{ marginTop: 18, marginBottom: 12, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#0092b7", fontWeight: "bold" }}>
                                VER M&Aacute;S
                            </Text>
                        </TouchableOpacity>
                    </>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: "gainsboro",
        borderWidth: 2,
        width: "90%",
        marginTop: 24,
        marginBottom: 32,
        padding: 12
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
    listButton: {
        flexDirection: "row",
        minHeight: 42,
        margin: 6,
        alignItems: "center",
        justifyContent: "center",
        paddingStart: 12,
        paddingEnd: 12
    },
});

export default PaymentsTable;