// import {baseAccountUrl, useAccountContext} from "./AccountContext.jsx";
// import {handleResponseError} from "../../utilities/errorResponse.js";
// import {showNotification} from "../../utilities/notificationSystem.js";
//
// function AccountAuthentication() {
//     const {dispatch, isAuthenticated, isLoading} = useAccountContext();
//
//      function isUserAuthenticated() {
//         try {
//             dispatch({type: "account/loading", payload: true});
//             const response = await fetch(`${baseAccountUrl}/manage/info`, {
//                 method: "GET",
//                 headers: {"Content-Type": "application/json",},
//             });
//             if (response.ok) {
//                 dispatch({type: "account/authenticated", payload: true});
//             } else {
//                 const errorData = await response.json();
//                 handleResponseError(errorData);
//             }
//         } catch (error) {
//             dispatch({type: "account/loading", payload: false});
//             showNotification("Error", "Internal server error", "red");
//         }
//
//     }
//
//     const isUserLoggedIn = isUserAuthenticated();
//     if (isUserLoggedIn) {
//         return <div>Authenticated</div>
//     } else {
//         return <div>Not Authenticated</div>
//     }
// }
//
// export default AccountAuthentication;