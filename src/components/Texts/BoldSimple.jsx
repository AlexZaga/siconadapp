import React from "react";
import { Text } from "react-native";

const BoldSimpleText = ({ boldText, normalText, fontSize = 16, boldExtraStyle = {}, simpleExtraStyle = {} }) => {
    return (
        <>
            <Text style={{ fontSize, fontWeight: "bold", ...boldExtraStyle }}>
                {boldText}&nbsp;
            </Text>
            <Text style={{ fontSize, ...simpleExtraStyle }}>
                {normalText}
            </Text>
        </>
    )
}

export default BoldSimpleText