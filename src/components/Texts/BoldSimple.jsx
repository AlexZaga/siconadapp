import React from "react";
import { Text } from "react-native";

const BoldSimpleText = ({ boldText, normalText, fontSize = 16 }) => {
    return (
        <>
            <Text style={{ fontSize, fontWeight: "bold" }}>
                {boldText}&nbsp;
            </Text>
            <Text style={{ fontSize }}>
                {normalText}
            </Text>
        </>
    )
}

export default BoldSimpleText