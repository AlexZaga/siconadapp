import AsyncStorage from '@react-native-async-storage/async-storage';

const saveSessionData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem("user_session", jsonValue);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

const saveTokenData = async (value) => {
    try {
        await AsyncStorage.setItem("token", value);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

const savePaymentTokenData = async (value) => {
    try {
        await AsyncStorage.setItem("token_pay", value);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

const getSessionData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('user_session');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const getTokenData = async () => {
    try {
        const tokenValue = await AsyncStorage.getItem('token');
        return tokenValue;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const getPaymentTokenData = async () => {
    try {
        const tokenValue = await AsyncStorage.getItem('token_pay');
        return tokenValue;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const addItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

const getItem = async (key) => {
    try {
        const savedItem = await AsyncStorage.getItem(key);
        return savedItem;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const deleteItem = async (key) => {
    try{
        await AsyncStorage.removeItem(key);
        return true;
    }catch (e) {
        console.log(e);
        return false;
    }
}

export { 
    saveSessionData, getSessionData, 
    saveTokenData, getTokenData, 
    deleteItem, getPaymentTokenData, 
    addItem, getItem,
    savePaymentTokenData }