export function validateEmail(email) {
    // Email pattern validation using regex
    const re = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase()) || "Invalid email format";
}