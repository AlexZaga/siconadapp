import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Modal, FlatList } from "react-native";
import { getSessionData, getTokenData, getPaymentTokenData } from "../../helpers/AStorage";
import { API_BASE_URL, API_PATHS, API_PAYMENT_BASE_URL } from "../../../assets/js/globals";
import axios from "axios";
import Spinner from "../Spinner";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import BoldSimpleText from "../Texts/BoldSimple";

const PaymentsDataTable = () => {
    const totalTableItems = 5;
    const [originalPaymentsList, setOriginalPaymentsList] = useState([]);
    const [paymentsList, setPaymentsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentsModalVisible, setPaymentsModalVisible] = useState(false);
    const [selectedPaymentItem, setSelectedPaymentItem] = useState({});
    const [page, setPage] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(totalTableItems);
    const listRef = useRef(null);

    useEffect(() => {
        loadPayments().then(() => {
            console.log(`Init Config: Pg: ${page} - Sidx: ${startIndex} - Eidx: ${endIndex} - Total Items: ${originalPaymentsList.length}`);
        })
        
    }, []);

    useEffect(() => {
        const newStartIdx = page * totalTableItems;
        const newEndIdx = Math.min(newStartIdx + totalTableItems, originalPaymentsList.length);
        setStartIndex(newStartIdx);
        setEndIndex(newEndIdx);
        setPaymentsList(originalPaymentsList.slice(newStartIdx, newEndIdx));
        listRef.current.scrollToOffset({ animated: true, offset: 0 });
    }, [page]);

    function openPaymentDialog(item) {
        setSelectedPaymentItem(item);
        setPaymentsModalVisible(true);
    }

    const handleClosePayModal = () => {
        setSelectedPaymentItem({});
        setPaymentsModalVisible(false);
    }

    const loadPayments = async () => {
        const userSession = await getSessionData();
        const token = await getPaymentTokenData();
        setIsLoading(true);
        const payments_url = API_PAYMENT_BASE_URL.concat(API_PATHS.payments).concat(userSession["matricula"]);
        try {
            const paymentsRequest = await axios.get(payments_url, { headers: { "Authorization": `Bearer ${token}` } })
            const payments = paymentsRequest.data.data;
            setOriginalPaymentsList(payments);
            setPaymentsList(payments.slice(startIndex, endIndex));
        } catch (ex) {
            console.log("Ha ocurrido un error al obtener los datos de pagos");
            console.log(ex);
        } finally {
            setIsLoading(false);
        }
    }

    const submitPayment = async () => {
        let tipoPago =
            selectedPaymentItem["concepto"] === "Pago de Inscripción" ? 1
                : selectedPaymentItem["concepto"] === "Pago de certificación" ? 3
                    : selectedPaymentItem["concepto"].startsWith("Colegiatura") ? 2
                        : 6;

        //this.addPayment[["matricula"]] = this.userId;
        //this.addPayment[["responsable"]] = this.usrName;
        //this.addPayment[["concepto"]] = item[["concepto"]];
        //this.addPayment[["monto_original"]] = item[["monto"]];
        //this.addPayment[["tipo_id"]] = parseInt(_tipo);
        //this.addPayment[["fecha_inicio"]] = this.timeStamp();
        //this.addPayment[["fecha_fin"]] = this.timeStamp();
        const userSession = await getSessionData();
        const paymentPayload = {
            "responsable": userSession.nombre,
            "estatus": 1,
            "forma_id": 1,
            "monto": selectedPaymentItem.monto,
            "pago_id": selectedPaymentItem.pagoId
        }

        console.log("Payment Post Data: ");
        console.log(paymentPayload);
        // Configurar Spinner para este modal
        const sptk = await getPaymentTokenData()
        const paymentHeaders = {
            "Authorization": `Bearer ${sptk}`
        }
        axios.post(API_PAYMENT_BASE_URL.concat(API_PATHS.abono), paymentPayload, { headers: paymentHeaders }).then(r => {
            if (r.status !== 200) {
                alert("Ha ocurrido un error al realizar el abono. Intente de nuevo.");
            } else {
                const { autorizacion } = r.data.data;
                const { message } = r.data;
                if (message === "Success") {
                    alert(`Se ha procesado correctamente el abono. Autorización: [${autorizacion}]`);
                } else {
                    alert(`Ha ocurrido un error al realizar el abono. ${message}`);
                }
            }
        }).catch(error => {
            console.log(error)
        }).finally(async () => {
            await loadPayments();
            setSelectedPaymentItem({});
            setPaymentsModalVisible(false);
        });
    }

    const PaymentModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={paymentsModalVisible}
                onRequestClose={() => setPaymentsModalVisible(!paymentsModalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.headerText}>{selectedPaymentItem.concepto}</Text>
                        <View style={styles.divisor} />
                        <View style={styles.modalContent}>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Fecha Periodo:"}
                                    normalText={selectedPaymentItem.fecha}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Fecha Vencimiento:"}
                                    normalText={selectedPaymentItem.vencimiento}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <Text>
                                    <Text style={styles.modalText}>
                                        Esta acci&oacute;n confirma el pago adeudado del mes de&nbsp;
                                    </Text>
                                    <BoldSimpleText
                                        boldText={selectedPaymentItem.mes}
                                        normalText={"por un monto de "}
                                        fontSize={16} />
                                    <BoldSimpleText
                                        boldText={`$${selectedPaymentItem.monto ? selectedPaymentItem.monto.toLocaleString() : "0.0"} MXN,`}
                                        normalText={"con folio de pago "}
                                        fontSize={16} />
                                    <Text style={styles.modalTextBold}>
                                        {selectedPaymentItem.pagoId}
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
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={submitPayment}
                                style={{ padding: 8 }}>
                                <Text style={{
                                    color: "#0092b7",
                                    fontSize: 16,
                                    marginTop: 8,
                                    textTransform: "uppercase"
                                }}>
                                    Realizar Pago
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleClosePayModal}
                                activeOpacity={0.5}
                                style={{ padding: 8 }}>
                                <Text style={{
                                    color: "#960018",
                                    fontSize: 16,
                                    marginTop: 8,
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


    const PaymentItem = ({ paymentData }) => {
        return (
            <View key={paymentData.autorizacion} style={{
                margin: 8,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 8,
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
                        normalText={paymentData.pagoId}
                        fontSize={16} />
                </View>
                <View style={styles.modalRow}>
                    <BoldSimpleText
                        boldText={"Concepto:"}
                        normalText={paymentData.concepto}
                        fontSize={16} />
                </View>
                <View style={styles.modalRow}>
                    <BoldSimpleText
                        boldText={"Periodo:"}
                        normalText={paymentData.fecha}
                        fontSize={16} />
                </View>
                <View style={styles.modalRow}>
                    <BoldSimpleText
                        boldText={"Monto:"}
                        normalText={paymentData.monto ? `$${paymentData.monto.toLocaleString()} MXN` : "0"}
                        fontSize={16} />
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
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Estatus</Text>
                        {
                            paymentData.estatusPago === "pagado" ?
                                <Image source={require("../../../assets/cash_ok.png")} style={{ tintColor: "#568203", width: 28, height: 28 }} /> :
                                <Text style={{ textTransform: "capitalize", fontSize: 14 }}>{paymentData.estatusPago}</Text>
                        }
                    </View>
                    <View style={{
                        flex: 1, justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                    }}>
                        {
                            paymentData.estatusPago !== "pagado" ?
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    style={{ width: 64, height: 64 }}
                                    onPress={() => { openPaymentDialog(paymentData) }}>
                                    <Image source={require("../../../assets/user_payment.png")}
                                        style={{
                                            tintColor: "#177245",
                                            width: 42, height: 42
                                        }} />
                                </TouchableOpacity> : null
                        }
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Calendario de Pagos</Text>
            <View style={styles.divisor} />
            <PaymentModal />
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
                            style={{ height: 480 }}
                            data={paymentsList}
                            renderItem={({ item }) => <PaymentItem paymentData={item} />}
                        />
                        <View style={{ margin: 24, alignItems: "flex-end", flexDirection: "row", justifyContent: "flex-end" }}>
                            <TouchableOpacity
                                disabled={page === 0}
                                activeOpacity={0.5}
                                style={{ width: 64, height: 64 }}
                                onPress={() => setPage(page - 1)}>
                                <Image source={require("../../../assets/back.png")} style={{ tintColor: page !== 0 ? "#000" : "gray", width: 42, height: 42 }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={endIndex === originalPaymentsList.length}
                                activeOpacity={0.5}
                                style={{ width: 64, height: 64 }}
                                onPress={() => setPage(page + 1)}>
                                <Image source={require("../../../assets/next.png")}
                                    style={{
                                        tintColor: endIndex === originalPaymentsList.length ? "gray" : "#000",
                                        width: 42, height: 42
                                    }} />
                            </TouchableOpacity>
                        </View>
                    </View>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 12
    },
    headerText: {
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 12
    },
    divisor: {
        backgroundColor: "#0092b7",
        height: "1%",
        width: "40%",
        marginBottom: 12
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
        marginTop: 12
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
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
        flex: 1,
        flexDirection: "column"
    },
    modalRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
        marginBottom: 8
    }
})

export default PaymentsDataTable;