import React, { createContext, useContext, useReducer } from 'react';

const Context = createContext();

const initialState = {
    showBackButton: false,
};

const ContextReducer = (state, action) => {
    switch (action.type) {
        case "TOOGLE_BUTTON":
            return {
                ...state,
                showBackButton: !state.showBackButton
            }
        default:
            return state;
    }
};

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ContextReducer, initialState);

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);