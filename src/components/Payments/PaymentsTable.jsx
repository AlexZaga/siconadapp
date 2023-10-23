import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Modal, Pressable } from "react-native";
import { API_PATHS, API_PAYMENT_BASE_URL } from "../../../assets/js/globals";
import axios from "axios"
import { getPaymentTokenData, getSessionData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";

const PaymentsTable = () => {
    const [paymentsData, setPaymentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [paymentModalData, setPaymentModalData] = useState({})

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


    useEffect(() => {
        console.log(paymentModalData)
    }, [paymentModalData]);


    function openPaymentDialog(item) {
        console.log("clicked")
        setPaymentModalData(item);
        setPaymentModalVisible(true);
    }

    const PaymentModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={paymentModalVisible}
                onRequestClose={() => setPaymentModalVisible(!paymentModalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.headerText}>{paymentModalData.concepto}</Text>
                        <View style={styles.divisor} />
                        <View style={styles.modalContent}>
                            <View style={styles.modalRow}>
                                <Text style={styles.modalTextBold}>
                                    Fecha Periodo:&nbsp;
                                </Text>
                                <Text style={styles.modalText}>
                                    {paymentModalData.fecha}
                                </Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Text style={styles.modalTextBold}>
                                    Fecha Vencimiento:&nbsp;
                                </Text>
                                <Text style={styles.modalText}>
                                    {paymentModalData.vencimiento}
                                </Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Text>
                                    <Text style={styles.modalText}>
                                        Esta acci&oacute;n confirma el pago adeudado del mes de&nbsp;
                                    </Text>
                                    <Text style={styles.modalTextBold}>
                                        {paymentModalData.mes}&nbsp;
                                    </Text>
                                    <Text style={styles.modalText}>
                                        por un monto de&nbsp;
                                    </Text>
                                    <Text style={styles.modalTextBold}>
                                        ${paymentModalData.monto ? paymentModalData.monto.toLocaleString() : "0.0"} MXN,&nbsp;
                                    </Text>
                                    <Text style={styles.modalText}>
                                        con folio de pago&nbsp;
                                    </Text>
                                    <Text style={styles.modalTextBold}>
                                        {paymentModalData.pagoId}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={{ width: "100%", backgroundColor: "gray", height: "1%" }} />
                        <View 
                            style={{ 
                                backgroundColor: "white", 
                                width: "100%", 
                                flexDirection: "row", 
                                justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={{ padding: 8 }}>
                                <Text style={{
                                    color: "#0092b7",
                                    fontSize: 16,
                                    margin: 8,
                                    textTransform: "uppercase"}}>
                                    Realizar Pago
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={{ padding: 8}}>
                                <Text style={{
                                    color: "#960018",
                                    fontSize: 16,
                                    margin: 8,
                                    textTransform: "uppercase"
                                }}>
                                    Cancelar Pago
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }


    const Item = ({ paymentData }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.listButton}>
                <View style={{ flexDirection: "column", flexGrow: 1 }}>
                    <Text style={{ flex: 1, fontSize: 18 }}>{paymentData.concepto}</Text>
                    <Text style={{ flex: 1, fontSize: 12 }}>Periodo: {paymentData.fecha} - ${paymentData.monto.toLocaleString("es-MX")}</Text>
                </View>
                {
                    paymentData.estatusPago === "pendiente" ?
                        <TouchableOpacity activeOpacity={0.5} style={{ marginEnd: 12 }} onPress={() => { openPaymentDialog(paymentData) }}>
                            <Image source={require("../../../assets/user_payment.png")} style={{ tintColor: "#177245", width: 28, height: 28 }} />
                        </TouchableOpacity> : null
                }
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
                        <PaymentModal />
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
        fontSize: 18,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 12,
        width: "80%",
        height: "35%",
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
        flex: 1, flexDirection: "column",
        height: "40%"
    },
    modalRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
        marginBottom: 8
    },
    modalTextBold: {
        fontSize: 16,
        fontWeight: "bold"
    },
    modalText: {
        fontSize: 16
    }
});

export default PaymentsTable;