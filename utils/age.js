export const myBirthday = "1999-03-03";

export function calculateAge(birthdate) {
    const today = new Date();
    const birthday = new Date(birthdate);

    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
}