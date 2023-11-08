import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Modal, FlatList, Pressable } from "react-native";
import { getSessionData, getTokenData, getPaymentTokenData } from "../../helpers/AStorage";
import { API_BASE_URL, API_PATHS, API_PAYMENT_BASE_URL } from "../../../assets/js/globals";
import axios from "axios";
import Spinner from "../Spinner";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import BoldSimpleText from "../Texts/BoldSimple";
import { ActivityIndicator } from "react-native-paper";


const defSelectedItem = {
    "concepto": "",
    "estatuspago": "",
    "vencimiento": "",
    "mes": "",
    "autorizacion": "",
    "monto": 0,
    "montoPagado": 0
}

const AccStatusDataTable = () => {
    const totalTableItems = 5;
    const [isLoading, setIsLoading] = useState(false);
    const [accStatusModalVisible, setAccStatusModalVisible] = useState(false);
    const [selectedPaymentItem, setSelectedPaymentItem] = useState(defSelectedItem);
    const [accInfo, setAccInfo] = useState({});
    const [originalPaymentsList, setOriginalPaymentsList] = useState([]);
    const [paymentsList, setPaymentsList] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(5);
    const [page, setPage] = useState(0);
    const listRef = useRef(null);

    const fetchAccStatus = async () => {
        try {
            const token = await getTokenData();
            const userInfo = await getSessionData()
            const acc_status_url = API_BASE_URL.concat(API_PATHS.status_cuenta).concat(userInfo["matricula"]);
            var payReq = await axios.get(acc_status_url, { headers: { "Authorization": `Bearer ${token}` } })
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
            if (accStatus && accStatus.status === 200) {
                setAccInfo(accStatus.data.data);
                setOriginalPaymentsList(accStatus.data.data.transacciones)
            } else {
                alert("No se han encontrado datos del estado de cuenta del alumno");
            }
            setIsLoading(false);
        })();
    }, []);


    useEffect(() => {
        if (originalPaymentsList.length > 0) {
            const filteredList = originalPaymentsList.slice(startIndex, endIndex);
            setPaymentsList(filteredList);
        }
        if (listRef.current) {
            listRef.current.scrollToOffset({ animated: true, offset: 0 });
        }
    }, [originalPaymentsList]);


    useEffect(() => {
        if (originalPaymentsList.length > 0) {
            const newStartIdx = page * totalTableItems;
            const newEndIdx = Math.min(newStartIdx + totalTableItems, originalPaymentsList.length);
            setStartIndex(newStartIdx);
            setEndIndex(newEndIdx);
            setPaymentsList(originalPaymentsList.slice(newStartIdx, newEndIdx));
            if (listRef.current) {
                listRef.current.scrollToOffset({ animated: true, offset: 0 });
            }
        }
    }, [page]);

    const PaymentItem = ({ paymentData }) => {
        return (
            <View key={paymentData.autorizacion} style={{
                margin: 8,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 12,
                width: "85%",
                alignItems: 'flex-start',
                alignSelf: "center",
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 3
            }}>
                <View style={styles.modalRow}>
                    <BoldSimpleText
                        boldText={"Folio:"}
                        normalText={paymentData._id}
                        fontSize={12} />
                </View>
                <View style={styles.modalRow}>
                    <BoldSimpleText
                        boldText={"Concepto:"}
                        normalText={paymentData.concepto}
                        fontSize={12} />
                </View>
                <View style={styles.modalRow}>
                    <BoldSimpleText
                        boldText={"Periodo:"}
                        normalText={paymentData.fecha}
                        fontSize={12} />
                </View>
                <View style={styles.modalRow}>
                    <BoldSimpleText
                        boldText={"Monto:"}
                        normalText={paymentData.monto ? `$${paymentData.monto.toLocaleString()} MXN` : "0"}
                        fontSize={12} />
                </View>
                <View style={{
                    flexDirection: "row",
                    margin: 8,
                    flex: 1
                }}>
                    <View style={{
                        flex: 1, justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center"
                    }}>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Estatus</Text>
                        {
                            paymentData.estatuspago === "pagado" ?
                                <Image source={require("../../../assets/cash_ok.png")} style={{ tintColor: "#568203", width: 28, height: 28 }} /> :
                                <Text style={{ textTransform: "capitalize", fontSize: 14 }}>{paymentData.estatuspago}</Text>
                        }
                    </View>
                    {
                        paymentData.estatuspago === "pagado" ? 
                            <View style={{
                                flex: 1, justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center"
                            }}>
                                <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>Fecha Pago</Text>
                                <Text style={{ fontSize: 12 }}>{paymentData.fechaautorizacion}</Text>
                            </View> : null
                    }
                </View>
            </View>
        )
    }

    const PaymentsPaginator = () => {
        return (
            <View style={{ margin: 12, alignItems: "flex-end", flexDirection: "row", justifyContent: "flex-end" }}>
                <Pressable
                    disabled={page === 0}
                    style={{ width: 42, height: 42 }}
                    onPress={() => { setPage(page - 1) }}>
                    <Image source={require("../../../assets/back.png")} style={{ tintColor: page !== 0 ? "#000" : "gray", width: 42, height: 42 }} />
                </Pressable>
                <Pressable
                    disabled={endIndex === originalPaymentsList.length}
                    style={{ width: 42, height: 42 }}
                    onPress={() => { setPage(page + 1) }}>
                    <Image source={require("../../../assets/next.png")}
                        style={{
                            tintColor: endIndex === originalPaymentsList.length ? "gray" : "#000",
                            width: 42, height: 42
                        }} />
                </Pressable>
            </View>
        )
    }

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <Text style={styles.headerText}>Estado De Cuenta</Text>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 8 }}>
                    <BoldSimpleText
                        fontSize={14}
                        boldText={"Monto Pagado: "}
                        normalText={`$${accInfo["montoPagado"] ? accInfo["montoPagado"].toLocaleString("es-MX") : 0.0} MXN`}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 8 }}>
                    <BoldSimpleText
                        fontSize={14}
                        boldText={"Monto Pendiente: "}
                        normalText={`$${accInfo["montoPendiente"] ? accInfo["montoPendiente"].toLocaleString("es-MX") : 0.0} MXN`}
                    />
                </View>
                <View style={styles.divisor} />
                {
                    //<PaymentModal />
                }

                {
                    isLoading ?
                        <Spinner /> :
                        <View>
                            <FlatList
                                ref={listRef}
                                ItemSeparatorComponent={<View style={{
                                    height: 2,
                                    backgroundColor: "gray",
                                    width: "80%",
                                    margin: "auto",
                                    justifyContent: "center",
                                    alignItems: "center", alignSelf: "center", alignContent: "center"
                                }} />}
                                scrollEnabled={true}
                                style={{ height: 360 }}
                                data={paymentsList}
                                initialNumToRender={5}
                                renderItem={({ item }) => <PaymentItem paymentData={item} />}
                            />
                            <PaymentsPaginator />
                        </View>
                }
            </View>
        </GestureHandlerRootView>
    )
}


const styles = StyleSheet.create({
    container: {
        margin: 12
    },
    headerText: {
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 8
    },
    divisor: {
        backgroundColor: "#0092b7",
        height: "1%",
        width: "40%",
        marginBottom: 12,
        marginTop: 12
    },
    tableHeader: {
        fontSize: 16,
        fontWeight: "bold",
        flexWrap: "wrap",
        flexShrink: 1,
        textAlign: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: "#F5F5F5"
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: "80%",
        height: "60%",
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContent: {
        flex: 1,
        flexDirection: "column"
    },
    modalRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
        marginBottom: 8
    }
});

export default AccStatusDataTable;