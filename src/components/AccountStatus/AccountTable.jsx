import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Modal } from "react-native";
import { API_BASE_URL, API_PATHS } from "../../../assets/js/globals";
import axios from "axios"
import { getSessionData, getTokenData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";
import BoldSimpleText from "../Texts/BoldSimple";
import { useNavigation, StackActions } from '@react-navigation/native'

const defSelectedItem = {
    "concepto": "",
    "estatuspago": "",
    "vencimiento": "",
    "mes": "",
    "autorizacion": "",
    "monto": 0,
    "montoPagado": 0
}

const AccountStatusTable = () => {
    const [accountStatus, setAccountStatus] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [accModalVisible, setAccModalVisible] = useState(false);
    const [selectedAccStatusItem, setAccStatusItem] = useState(defSelectedItem);
    const [transList, setTransList] = useState([]);
    //const fontScale = PixelRatio.getFontScale();
    const { dispatch } = useNavigation()
    //const getFontSize = size => size / fontScale;

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
            if ( accStatus && accStatus.status === 200) {
                setAccountStatus(accStatus.data.data);
                setTransList(accStatus.data.data["transacciones"]);
            }else {
                alert("No se han encontrado datos del estado de cuenta del alumno");
            }
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        console.log(transList.slice(0,3))
    }, [transList])

    function openAccStatusModal(item) {
        setAccStatusItem(item);
        setAccModalVisible(true);
    }

    const handleCloseAccStatusModal = () => {
        setAccStatusItem(defSelectedItem);
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
                        <Text style={styles.headerText}>{selectedAccStatusItem["concepto"]}</Text>
                        <View style={styles.divisor} />
                        <View style={styles.modalContent}>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Estatus del Pago:"}
                                    normalText={
                                        selectedAccStatusItem["estatuspago"].toUpperCase()
                                    }
                                    fontSize={12} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Fecha de Vencimiento:"}
                                    normalText={selectedAccStatusItem["vencimiento"]}
                                    fontSize={12} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Mes de Pago:"}
                                    normalText={selectedAccStatusItem["mes"]}
                                    fontSize={12} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Monto de Factura:"}
                                    normalText={`$${selectedAccStatusItem["monto"].toLocaleString()} MXN`}
                                    fontSize={12} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Monto Pagado:"}
                                    normalText={`$${selectedAccStatusItem.montoPagado.toLocaleString()} MXN`}
                                    fontSize={12} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Autorizacion:"}
                                    normalText={selectedAccStatusItem.autorizacion}
                                    fontSize={12} />
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
                        <Text style={{ flex: 1, fontSize: 12 }}>
                        {accData.fecha} - {accData.canalPago === 1 ? "Efectivo" : accData.canalPago === 2 ? "Banco" : "No Pagado"}</Text>
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
                    <BoldSimpleText
                        boldText={"Monto Pagado: "}
                        normalText={`${accountStatus["montoPagado"] ? accountStatus["montoPagado"].toLocaleString("es-MX") : 0.0}MXN`}
                    />
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 8 }}>
                    <BoldSimpleText
                        boldText={"Monto Pendiente: "}
                        normalText={`${accountStatus["montoPendiente"] ? accountStatus["montoPendiente"].toLocaleString("es-MX") : 0.0}MXN`}
                    />
                </View>
                <View style={{ marginTop: 12, display: transList.length > 0 ? "flex" : "none" }}>
                    <FlatList
                        ItemSeparatorComponent={<View style={{ height: "3%", backgroundColor: "gray" }} />}
                        scrollEnabled={false}
                        style={{ height: 180 }}
                        data={transList.slice(0, 3)}
                        renderItem={({ item }) => <Item accData={item} />}
                        keyExtractor={item => item._id}
                    />
                    {
                        transList.length > 3 ?
                            <TouchableOpacity 
                                onPress={() => dispatch(StackActions.push("TableDetails", { component_to_render: "acc_status" }))}
                                style={{ marginTop: 18, marginBottom: 12, justifyContent: "center", alignItems: "center" }}>
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
            <AccStatusModal />
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
        height: "55%",
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