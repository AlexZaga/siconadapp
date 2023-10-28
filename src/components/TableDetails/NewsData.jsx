import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Modal } from "react-native";
import { DataTable } from 'react-native-paper';
import { getSessionData, getTokenData } from "../../helpers/AStorage";
import { API_BASE_URL, API_PATHS } from "../../../assets/js/globals";
import axios from "axios";
import Spinner from "../Spinner";
import { TouchableOpacity } from "react-native-gesture-handler";
import BoldSimpleText from "../Texts/BoldSimple";

const NewsDataTable = () => {
    const [newsList, setNewsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newsModalVisible, setNewsModalVisible] = useState(false);
    const [selectedNewsItem, setSelectedNewsItem] = useState({});
    const [page, setPage] = useState(0);


    const from = page * 5;
    const to = Math.min((page + 1) * 5, newsList.length);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const newsData = await fetchNews();
            if (newsData.status === 200) {
                const sortedNews = newsData.data.data.sort(sortDates)
                setNewsList(sortedNews)
            }
            setIsLoading(false);
        })();
    }, []);


    const sortDates = (a, b) => {
        var d1 = new Date(a.fechaorigen)
        var d2 = new Date(b.fechaorigen);
        if (d1 > d2) {
            return -1
        } else if (d1 < d2) {
            return 1
        }
        return 0
    }

    const fetchNews = async () => {
        try {
            const token = await getTokenData();
            const news_url = API_BASE_URL.concat(API_PATHS.news);
            var newsReq = await axios.get(news_url, { headers: { "Authorization": `Bearer ${token}` } })
            return newsReq;
        } catch (ex) {
            console.log(ex);
            return null;
        }
    }

    function openNewsModal(item) {
        const actualDate = new Date(item.fechaorigen);
        const validMonth = actualDate.getMonth() + 1;
        const formattedDate = actualDate.getDate() + "/" + validMonth + "/" + actualDate.getFullYear()

        setSelectedNewsItem({ ...item, formattedDate });
        setNewsModalVisible(true);

    }

    const handleCloseNewsModal = () => {
        setSelectedNewsItem({});
        setNewsModalVisible(false);
    }

    const NewsInfoModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={newsModalVisible}
                onRequestClose={() => setNewsModalVisible(!newsModalVisible)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.headerText}>{selectedNewsItem.titulo}</Text>
                        <View style={styles.divisor} />
                        <View style={styles.modalContent}>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Fecha:"}
                                    normalText={selectedNewsItem.formattedDate}
                                    fontSize={16} />
                            </View>
                            <View style={styles.modalRow}>
                                <BoldSimpleText
                                    boldText={"Comunicado:"}
                                    normalText={selectedNewsItem.mensaje}
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
                                onPress={handleCloseNewsModal}
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
            <Text style={styles.headerText}>Comunicados Presidencia</Text>
            <View style={styles.divisor} />
            <NewsInfoModal />
            {
                isLoading ?
                    <View 
                        style={{ 
                            justifyContent: "center", 
                            alignItems: "center", 
                            alignContent: "center" }}>
                        <Spinner />
                    </View> :
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title textStyle={styles.tableHeader}>Nombre del comunicado</DataTable.Title>
                            <DataTable.Title textStyle={styles.tableHeader}>
                                Informaci&oacute;n
                            </DataTable.Title>
                        </DataTable.Header>

                        {newsList.slice(from, to).map((item) => (
                            <DataTable.Row key={item._id} onPress={(i) => { openNewsModal(item) }}>
                                <DataTable.Cell>
                                    <Text>
                                        {item.titulo}
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
                            numberOfPages={Math.ceil(newsList.length / 5)}
                            onPageChange={(page) => setPage(page)}
                            label={`${from + 1}-${to} of ${newsList.length}`}
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
        flex: 0,
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

export default NewsDataTable;