import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Modal } from "react-native";
import { DataTable } from 'react-native-paper';
import { getSessionData, getTokenData } from "../../helpers/AStorage";
import { API_BASE_URL, API_PATHS } from "../../../assets/js/globals";
import axios from "axios";
import Spinner from "../Spinner";
import { TouchableOpacity } from "react-native-gesture-handler";
import BoldSimpleText from "../Texts/BoldSimple";

const SubjectsDataTable = () => {
    const [subjectsList, setSubjectsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [subjectsModalVisible, setSubjectsModalVisible] = useState(false);
    const [selectedSubjectsItem, setSelectedSubjectsItem] = useState({});
    const [page, setPage] = useState(0);


    const from = page * 5;
    const to = Math.min((page + 1) * 5, subjectsList.length);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const subjects = await fetchSubjects();
            if (subjects && subjects.status === 200) {
                const preSubjects = subjects.data.data
                console.log(preSubjects);
                setSubjectsList(preSubjects)
            } else {
                alert("Ha ocurrido un error al obtener los datos de las asignaturas");
            }
            setIsLoading(false);
        })();
    }, []);

    const fetchSubjects = async () => {
        try {
            const token = await getTokenData();
            const userInfo = await getSessionData()
            const plans_url = API_BASE_URL.concat(API_PATHS.plans);
            const plansReq = await axios.get(plans_url, { headers: { "Authorization": `Bearer ${token}` } })
            const planes = plansReq.data.data;
            const planInfo = planes.filter((x) => x["nombre"] === userInfo["planacademico"])
            if (planInfo.length === 0) {
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

    function openSubjectsModal(item) {
        setSelectedSubjectsItem(item);
        setSubjectsModalVisible(true);

    }

    const handleCloseSubjectsModal = () => {
        setSelectedSubjectsItem({});
        setSubjectsModalVisible(false);
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
                                style={{ padding: 8, width: "100%", justifyContent: "center", alignItems: "center" }}>
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
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title textStyle={styles.tableHeader}>Asignatura</DataTable.Title>
                            <DataTable.Title textStyle={styles.tableHeader}>Plan de Estudios</DataTable.Title>
                            <DataTable.Title textStyle={styles.tableHeader}>
                                Informaci&oacute;n
                            </DataTable.Title>
                        </DataTable.Header>

                        {subjectsList.slice(from, to).map((item) => (
                            <DataTable.Row key={item.asignaturaId} onPress={(i) => { openSubjectsModal(item) }}>
                                <DataTable.Cell>
                                    <Text>
                                        {item.asignatura}
                                    </Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text>
                                        {item.productoNombre}
                                    </Text>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <Image source={require("../../../assets/info.png")} style={{ tintColor: "gray", width: 28, height: 28 }} />
                                    </View>
                                    
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}

                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(subjectsList.length / 5)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${subjectsList.length}`}
                            numberOfItemsPerPage={5}
                            showFastPaginationControls
                        />
                    </DataTable>
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

export default SubjectsDataTable;