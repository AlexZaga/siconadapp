import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Modal, Pressable } from "react-native";
import { API_BASE_URL, API_PATHS, API_PAYMENT_BASE_URL } from "../../../assets/js/globals";
import axios from "axios"
import { getPaymentTokenData, getSessionData, getTokenData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";
import BoldSimpleText from "../Texts/BoldSimple";
import { useNavigation, StackActions } from '@react-navigation/native'

const PaymentsTable = () => {
    const [paymentsData, setPaymentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [paymentInfoModalVisible, setPaymentInfoModalVisible] = useState(false);
    const [paymentModalData, setPaymentModalData] = useState({});
    const [paymentInfoData, setPaymentInfoData] = useState({});
    const [userSession, setUserSession] = useState({});
    const { dispatch } = useNavigation()

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
            const token = await getTokenData();
            const userInfo = await getSessionData()
            //const payments_url = API_PAYMENT_BASE_URL.concat(API_PATHS.payments).concat(userInfo["matricula"]);
            const payments_url = API_BASE_URL.concat(API_PATHS.payments_mat).concat(userInfo["matricula"]);
            var payReq = await axios.get(payments_url, { headers: { "Authorization": `Bearer ${token}` } })
            return payReq;
        } catch (ex) {
            console.log(ex);
            if (ex.response){
                console.log(ex.response.data);
            }
            return null;
        }
    }

    async function loadPayments(){
        setIsLoading(true);
        const paymentsData = await fetchPayments();
        if (paymentsData.status === 200) {
            const sortedPayments = paymentsData.data.data.sort(sortDates);
            setPaymentsData(sortedPayments);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        loadPayments().then(async () => {
            const userData = await getSessionData();
            setUserSession(userData);
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setIsLoading(false);
        });
        console.log("Loaded Data from Payments");
    }, []);


    useEffect(() => {
        console.log(paymentsData)
    }, [paymentsData]);


    function openPaymentDialog(item) {
        setPaymentModalData(item);
        setPaymentModalVisible(true);
    }

    function openPaymentInfoDialog(item) {
        console.log(item);
        setPaymentInfoData(item);
        setPaymentInfoModalVisible(true);
    }

    const handleClosePayModal = () => {
        setPaymentModalData({});
        setPaymentModalVisible(false);
    }

    const handleCloseInfoPayModal = () => {
        setPaymentInfoData({});
        setPaymentInfoModalVisible(false);
    }

    const submitPayment = async () => {
        let tipoPago =
            paymentModalData["concepto"] === "Pago de Inscripción" ? 1
                : paymentModalData["concepto"] === "Pago de certificación" ? 3
                    : paymentModalData["concepto"].startsWith("Colegiatura") ? 2
                        : 6;

        //this.addPayment[["matricula"]] = this.userId;
        //this.addPayment[["responsable"]] = this.usrName;
        //this.addPayment[["concepto"]] = item[["concepto"]];
        //this.addPayment[["monto_original"]] = item[["monto"]];
        //this.addPayment[["tipo_id"]] = parseInt(_tipo);
        //this.addPayment[["fecha_inicio"]] = this.timeStamp();
        //this.addPayment[["fecha_fin"]] = this.timeStamp();
        const paymentPayload = {
            "responsable": userSession.nombre,
            "estatus": 1,
            "forma_id": 1,
            "monto": paymentModalData.monto,
            "pago_id": paymentModalData.pagoId
        }

        console.log("Payment Post Data: ");
        console.log(paymentPayload);
        // Configurar Spinner para este modal
        const sptk = await getPaymentTokenData()
        const paymentHeaders = {
            "Authorization": `Bearer ${sptk}`
        }
        axios.post(API_PAYMENT_BASE_URL.concat(API_PATHS.abono), paymentPayload, { headers: paymentHeaders }).then(r => {
            if (r.status !== 200){
                alert("Ha ocurrido un error al realizar el abono. Intente de nuevo.");
            }else {
                const { autorizacion } = r.data.data;
                const {message} = r.data;
                if (message === "Success"){
                    alert(`Se ha procesado correctamente el abono. Autorización: [${autorizacion}]`);
                }else{
                    alert(`Ha ocurrido un error al realizar el abono. ${message}`);
                }
            }
        }).catch(error => {
            console.log(error)
        }).finally(async () => {
            await loadPayments();
            setPaymentModalData({});
            setPaymentModalVisible(false);
        });
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
                                <BoldSimpleText
                                    boldText={"Fecha Periodo:"}
                                    normalText={paymentModalData.fecha}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Fecha Vencimiento:"}
                                    normalText={paymentModalData.vencimiento}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <Text>
                                    <Text style={styles.modalText}>
                                        Esta acci&oacute;n confirma el pago adeudado del mes de&nbsp;
                                    </Text>
                                    <BoldSimpleText
                                        boldText={paymentModalData.mes}
                                        normalText={"por un monto de "}
                                        fontSize={16} />
                                    <BoldSimpleText
                                        boldText={`$${paymentModalData.monto ? paymentModalData.monto.toLocaleString() : "0.0"} MXN,`}
                                        normalText={"con folio de pago: "}
                                        fontSize={16} />
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: "bold"
                                    }}>
                                        {paymentModalData._id}
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

    const PaymentInfoModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={paymentInfoModalVisible}
                onRequestClose={() => setPaymentInfoModalVisible(!paymentInfoModalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.headerText}>{paymentInfoData.concepto}</Text>
                        <View style={styles.divisor} />
                        <View style={styles.modalContent}>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Folio Pago:"}
                                    normalText={paymentInfoData.pagoId}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Mes:"}
                                    normalText={paymentInfoData.mes}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Fecha período:"}
                                    normalText={paymentInfoData.fecha}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Fecha vencimiento:"}
                                    normalText={paymentInfoData.vencimiento}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Monto a Pagar:"}
                                    normalText={`$${paymentInfoData.monto ? paymentInfoData.monto.toLocaleString() : "0.0"} MXN`}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Estatus de Pago:"}
                                    normalText={paymentInfoData.estatuspago ? paymentInfoData.estatuspago.toUpperCase() : ""}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Folio autorización:"}
                                    normalText={paymentInfoData.autorizacion}
                                    fontSize={16} />
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
                                onPress={handleCloseInfoPayModal}
                                style={{ padding: 8 }}>
                                <Text style={{
                                    color: "#0092b7",
                                    fontSize: 16,
                                    marginTop: 8,
                                    textTransform: "uppercase"
                                }}>
                                    Cerrar informaci&oacute;n
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
                key={paymentData.autorizacion}
                activeOpacity={0.5}
                onPress={() => { openPaymentInfoDialog(paymentData) }}
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
                <Image
                    source={require("../../../assets/info.png")}
                    style={{ tintColor: "gray", width: 28, height: 28 }} />
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
                        <PaymentInfoModal />
                        <FlatList
                            ItemSeparatorComponent={<View style={{ height: "3%", backgroundColor: "gray" }} />}
                            scrollEnabled={false}
                            style={{ height: 200 }}
                            data={paymentsData.slice(0, 3)}
                            renderItem={({ item }) => <Item paymentData={item} />}
                            keyExtractor={item => item.autorizacion}
                        />
                        {
                            paymentsData.length > 3 ? <TouchableOpacity
                                onPress={() => dispatch(StackActions.push("TableDetails", { component_to_render: "payments" }))}
                                style={{ marginTop: 18, marginBottom: 12, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "#0092b7", fontWeight: "bold" }}>
                                    VER M&Aacute;S
                                </Text>
                            </TouchableOpacity> : null
                        }
                        
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
        backgroundColor: "#F5F5F5",
        //opacity: 0.5
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: "80%",
        height: "70%",
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