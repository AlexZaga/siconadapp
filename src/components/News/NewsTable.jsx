import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import { API_BASE_URL, API_PATHS } from "../../../assets/js/globals";
import axios from "axios"
import { getTokenData } from "../../helpers/AStorage";
import Spinner from "../../components/Spinner";

const NewsTable = () => {
    const [newsData, setNewsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    const Item = ({ newsData }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.listButton}>
                <Text style={{ flex: 1, fontSize: 18 }}>{newsData.titulo}</Text>
                <Image source={require("../../../assets/info.png")} style={{ tintColor: "gray", width: 28, height: 28 }} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Comunicados</Text>
            <View style={styles.divisor} />
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
        margin: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingStart: 12,
        paddingEnd: 12
    },
});

export default NewsTable;