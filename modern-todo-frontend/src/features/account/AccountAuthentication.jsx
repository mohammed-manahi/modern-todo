import {useEffect, useState} from "react";

function ProtectedInfoComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const checkAuth = async () => {
            const response = await fetch("https://localhost:7092/Account/manage/info", {
                method: "GET",
                headers: {"accept": "application/json", "Authorization": `Bearer ${token}`, },
            });
            console.log("Response", response)
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(data);
                console.log(data);
            } else {
                console.error("Failed to check authentication");
            }
        };
        checkAuth();
    }, []);

    return (
        <div>
            {isLoggedIn ? (
                <p>You are authenticated and can access protected info.</p>
            ) : (
                <p>Please login to access protected information.</p>
            )}
        </div>
    );
}

export default ProtectedInfoComponent;