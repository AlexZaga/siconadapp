import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Modal } from "react-native";
import { API_BASE_URL, API_PATHS } from "../../../assets/js/globals";
import axios from "axios"
import { getSessionData, getTokenData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";
import BoldSimpleText from "../Texts/BoldSimple";

const SubjectsTable = () => {
    const [subjectsData, setSubjectsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [subjectsModalVisible, setSubjectsModalVisible] = useState(false);
    const [selectedSubjectsItem, setSelectedSubjectsItem] = useState({});

    const fetchSubjects = async () => {
        try {
            const token = await getTokenData();
            const userInfo = await getSessionData()
            const plans_url = API_BASE_URL.concat(API_PATHS.plans);
            const plansReq = await axios.get(plans_url, { headers: { "Authorization": `Bearer ${token}` } })
            const planes = plansReq.data.data;
            const planInfo = planes.filter((x) => x["nombre"] === userInfo["planacademico"])
            if (planInfo.length === 0){
                console.log("No se ha encontrado el plan de estudios asignado al alumno");
                return null;
            }
            const planId = planInfo[0]["_id"]
            const subjects_url = API_BASE_URL.concat(API_PATHS.subjects).concat(planId)
            const subsReq = await axios.get(subjects_url, { headers: { "Authorization": `Bearer ${token}` } })

            return subsReq

        } catch (ex) {
            console.log(ex);
            return null;
        }
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const subjects = await fetchSubjects();
            if ( subjects && subjects.status === 200) {
                const preSubjects = subjects.data.data.slice(0, 3);
                console.log(preSubjects);
                setSubjectsData(preSubjects)
            }else{
                alert("Ha ocurrido un error al obtener los datos de las asignaturas");
            }
            setIsLoading(false);
        })();
        console.log("Loaded Data from Subjects");
    }, []);

    function openSubjectsModal(item) {
        setSelectedSubjectsItem(item);
        setSubjectsModalVisible(true);

    }

    const handleCloseSubjectsModal = () => {
        setSelectedSubjectsItem({});
        setSubjectsModalVisible(false);
    }

    const Item = ({ subjectData }) => {
        return (
            <View style={{ 
                flexDirection: "row", 
                justifyContent:"space-between"}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.listButton}>
                    <Text style={{ flex: 1, fontSize: 16 }}>
                        {subjectData.asignatura}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{ justifyContent: "center", flex: 1 }}
                    activeOpacity={0.5} 
                    onPress={() => { openSubjectsModal(subjectData) }}>
                    <Image source={require("../../../assets/info.png")} style={{ tintColor: "gray", width: 28, height: 28 }} />
                </TouchableOpacity>
            </View>
        )
    }

    const SubjectsInfoModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={subjectsModalVisible}
                onRequestClose={() => setSubjectsModalVisible(!subjectsModalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.headerText}>{selectedSubjectsItem.asignatura}</Text>
                        <View style={styles.divisor} />
                        <View style={styles.modalContent}>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Plan:"}
                                    normalText={selectedSubjectsItem.productoNombre}
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
                                onPress={handleCloseSubjectsModal}
                                style={{ padding: 8, width: "80%", justifyContent: "center", alignItems: "center" }}>
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

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Asignaturas</Text>
            <View style={styles.divisor} />
            <SubjectsInfoModal />
            {
                isLoading ? 
                    <Spinner /> :
                    <>
                        <FlatList
                            ItemSeparatorComponent={<View style={{ height: "3%", backgroundColor: "gray" }} />}
                            scrollEnabled={false}
                            style={{ height: "100%" }}
                            data={subjectsData}
                            renderItem={({ item }) => <Item subjectData={item} />}
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
        minHeight: 52,
        margin: 8,
        flex: 4,
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
});

export default SubjectsTable;