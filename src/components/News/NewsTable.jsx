import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Modal } from "react-native";
import { API_BASE_URL, API_PATHS } from "../../../assets/js/globals";
import axios from "axios"
import { getTokenData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";
import BoldSimpleText from "../Texts/BoldSimple";

const NewsTable = () => {
    const [newsData, setNewsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newsModalVisible, setNewsModalVisible] = useState(false);
    const [selectedNewsItem, setSelectedNewsItem] = useState({});

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const newsData = await fetchNews();
            if (newsData.status === 200) {
                const sortedNews = newsData.data.data.sort(sortDates).slice(0, 3);
                setNewsData(sortedNews)
            }
            setIsLoading(false);
        })();
        console.log("Loaded Data from News");
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

    function openNewsModal(item){
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

    const Item = ({ newsData }) => {
        return (
            <View style={{ 
                flexDirection: "row", 
                justifyContent:"space-between"}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.listButton}>
                    <Text style={{ flex: 1, fontSize: 18 }}>{newsData.titulo}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{ justifyContent: "center", flex: 1 }}
                    activeOpacity={0.5} 
                    onPress={() => { openNewsModal(newsData) }}>
                    <Image source={require("../../../assets/info.png")} style={{ tintColor: "gray", width: 28, height: 28 }} />
                </TouchableOpacity>
            </View>
        )
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
                                style={{ padding: 8, width: "80%", justifyContent:"center", alignItems: "center" }}>
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
            <Text style={styles.headerText}>Comunicados</Text>
            <View style={styles.divisor} />
            <NewsInfoModal />
            {
                isLoading ?
                    <Spinner /> :
                    <>
                        <FlatList
                            ItemSeparatorComponent={<View style={{ height: "3%", backgroundColor: "gray" }} />}
                            scrollEnabled={false}
                            style={{ height: "100%" }}
                            data={newsData}
                            renderItem={({ item }) => <Item newsData={item} />}
                            keyExtractor={item => item._id} />
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

export default NewsTable;