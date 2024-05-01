import {showNotification} from "./notificationSystem.js";

export function handleResponseError(errorData){
    // Error data handle for errors coming from the backend by looping through an object of arrays
    const errorKeys = Object.keys(errorData.errors);
    errorKeys.forEach(errorKey => {
        const errorMessages = errorData.errors[errorKey];
        errorMessages.forEach(errorMessage => {
            showNotification("Error", errorMessage, "red");
        });
    });
}