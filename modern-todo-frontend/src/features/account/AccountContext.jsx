import {createContext, useContext, useReducer} from "react";

const baseAccountUrl = "https://localhost:7092/account";

const AccountContext = createContext();

const initialState = {
    email: "",
    password: "",
    confirmPassword: "",
    isLoading: false,
    errors: {}
}

function reducer(state, action) {
    switch (action.type) {
        case "account/loading":
            return {...state, isLoading: action.payload};
        case "account/register":
            return {
                ...state,
                isLoading: false,
                email: action.payload.email,
                password: action.payload.password,
                confirmPassword: action.payload.confirmPassword
            };
        case "account/error":
            return {...state, errors: action.payload};
        default:
            return state;
    }
}

function AccountProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <AccountContext.Provider value={{
            dispatch: dispatch,
            errors: state.errors,
            isLoading: state.isLoading,
        }}>
            {children}
        </AccountContext.Provider>
    );
}

function useAccountContext() {
    const accountConsumer = useContext(AccountContext);
    if (accountConsumer === undefined) {
        throw new Error("Consumer of account context is undefined because it was invoked outside the context provider");
    }
    return accountConsumer;
}


export {AccountProvider, useAccountContext, baseAccountUrl};