import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import { API_PATHS, API_PAYMENT_BASE_URL } from "../../../assets/js/globals";
import axios from "axios"
import { getPaymentTokenData, getSessionData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";

const AccountStatusTable = () => {
    const [accountStatus, setAccountStatus] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchAccStatus = async () => {
        try {
            const token = await getPaymentTokenData();
            const userInfo = await getSessionData()
            const payments_url = API_PAYMENT_BASE_URL.concat(API_PATHS.acc_status);
            const actualYear = new Date().getFullYear().toString();
            const payload = {
                "fechaInicio": `${actualYear}-01-01`,
                "fechaFin": `${actualYear}-12-31`,
                "id": userInfo["matricula"]
            }
            var payReq = await axios.post(payments_url, payload, { headers: { "Authorization": `Bearer ${token}` } })
            return payReq;
        } catch (ex) {
            console.log(ex);
            return null;
        }
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const accStatus = await fetchAccStatus();
            console.log(accStatus.data)
            if (accStatus.status === 200) {
                //console.log(accStatus.data)
                setAccountStatus(accStatus.data.data);
            }
            setIsLoading(false);
        })();
        console.log("Loaded Data from AccStatus");
    }, []);

    useEffect(() => {
        console.log(accountStatus)
    }, [accountStatus])

    const Item = ({ accData }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.listButton}>
                <View style={{ flexDirection: "column", flexGrow: 1 }}>
                    <Text style={{ flex: 1, fontSize: 18 }}>{accData.concepto}</Text>
                    <Text style={{ flex: 1, fontSize: 12 }}>{accData.fecha} - {accData.canalPago}</Text>
                </View>
                <Image source={require("../../../assets/info.png")} style={{ tintColor: "gray", width: 28, height: 28 }} />
            </TouchableOpacity>
        )
    }

    const AccStatusCard = () => {
        return (
            <View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Monto Pagado:&nbsp;
                    </Text>
                    <Text style={{ fontSize: 18 }}>
                        ${
                            accountStatus["pagado"] ? accountStatus.pagado.toLocaleString("es-MX") : 0.0
                        }
                        MXN
                    </Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 8, marginBottom: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Monto Pendiente:&nbsp;
                    </Text>
                    <Text style={{ fontSize: 18 }}>
                        ${
                            accountStatus["por pagar"] ? accountStatus["por pagar"].toLocaleString("es-MX") : 0.0
                        }
                        MXN
                    </Text>
                </View>
                <View style={{ padding: 0 }}>
                    <FlatList
                        ItemSeparatorComponent={<View style={{ height: "3%", backgroundColor: "gray" }} />}
                        scrollEnabled={false}
                        style={{ height: 180 }}
                        data={accountStatus["detalle"]}
                        renderItem={({ item }) => <Item accData={item} />}
                        keyExtractor={item => item.pagoId}
                    />
                    {
                        accountStatus["detalle"] && accountStatus["detalle"].length > 3 ?
                            <TouchableOpacity style={{ marginTop: 18, marginBottom: 12, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "#0092b7", fontWeight: "bold" }}>
                                    VER M&Aacute;S
                                </Text>
                            </TouchableOpacity> : null
                    }
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Estado de Cuenta</Text>
            <View style={styles.divisor} />
            {
                isLoading ? <Spinner /> :
                    <AccStatusCard />
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

export default AccountStatusTable;