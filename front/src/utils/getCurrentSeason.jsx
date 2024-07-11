export const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1
    if (month >= 1 && month <= 3) {
        return 'Winter';
    } else if (month >= 4 && month <= 6) {
        return 'Spring';
    } else if (month >= 7 && month <= 9) {
        return 'Summer';
    } else {
        return 'Fall';
    }
};