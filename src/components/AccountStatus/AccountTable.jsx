import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, PixelRatio, Modal } from "react-native";
import { API_PATHS, API_PAYMENT_BASE_URL } from "../../../assets/js/globals";
import axios from "axios"
import { getPaymentTokenData, getSessionData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";
import BoldSimpleText from "../Texts/BoldSimple";

const AccountStatusTable = () => {
    const [accountStatus, setAccountStatus] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [accModalVisible, setAccModalVisible] = useState(false);
    const [selectedAccStatusItem, setAccStatusItem] = useState({});
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = size => size / fontScale;

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

    function openAccStatusModal(item) {
        setAccStatusItem(item);
        setAccModalVisible(true);
    }

    const handleCloseAccStatusModal = () => {
        setAccStatusItem({});
        setAccModalVisible(false);
    }

    const AccStatusModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={accModalVisible}
                onRequestClose={() => setAccModalVisible(!accModalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.headerText}>{selectedAccStatusItem.concepto}</Text>
                        <View style={styles.divisor} />
                        <View style={styles.modalContent}>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Estatus del Pago:"}
                                    normalText={selectedAccStatusItem.canalPago}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Fecha de Vencimiento:"}
                                    normalText={selectedAccStatusItem.vencimiento}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Mes de Pago:"}
                                    normalText={selectedAccStatusItem.mes}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Monto de Factura:"}
                                    normalText={`$${selectedAccStatusItem.monto.toLocaleString()} MXN`}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Monto Pagado:"}
                                    normalText={`$${selectedAccStatusItem.montoPagado.toLocaleString()} MXN`}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"ID de Pago:"}
                                    normalText={selectedAccStatusItem.pagoId}
                                    fontSize={16} />
                            </View>
                        </View>
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
                                onPress={handleCloseAccStatusModal}
                                style={{
                                    padding: 8,
                                    width: "80%",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                <Text style={{
                                    color: "#0092b7",
                                    fontSize: 16,
                                    marginTop: 8,
                                    textTransform: "uppercase"
                                }}>
                                    Cerrar Informaci&oacute;n
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    const Item = ({ accData }) => {
        return (
            <View style={{ 
                flexDirection: "row", 
                justifyContent:"space-between"}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.listButton}>
                    <View style={{ flexDirection: "column", flexGrow: 1 }}>
                        <Text style={{ flex: 1, fontSize: 18 }}>{accData.concepto}</Text>
                        <Text style={{ flex: 1, fontSize: 12 }}>{accData.fecha} - {accData.canalPago}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{ justifyContent: "center", flex: 1 }}
                    activeOpacity={0.5} 
                    onPress={() => { openAccStatusModal(accData) }}>
                    <Image
                        source={require("../../../assets/info.png")}
                        style={{ tintColor: "gray", width: 28, height: 28 }} />
                </TouchableOpacity>
            </View>
        )
    }

    const AccStatusCard = () => {
        return (
            <View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 8 }}>
                    <Text adjustsFontSizeToFit style={{ fontSize: getFontSize(18), fontWeight: "bold" }}>
                        Monto Pagado:&nbsp;
                    </Text>
                    <Text adjustsFontSizeToFit style={{ fontSize: getFontSize(18) }}>
                        ${
                            accountStatus["pagado"] ? accountStatus.pagado.toLocaleString("es-MX") : 0.0
                        }
                        MXN
                    </Text>
                </View>
                <View adjustsFontSizeToFit
                    style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 8, marginBottom: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Monto Pendiente:&nbsp;
                    </Text>
                    <Text adjustsFontSizeToFit style={{ fontSize: 18 }}>
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
                selectedAccStatusItem["pagoId"] ? <AccStatusModal /> : null
            }

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
        flex: 4,
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
        marginTop: 12
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: "80%",
        height: "45%",
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

export default AccountStatusTable;