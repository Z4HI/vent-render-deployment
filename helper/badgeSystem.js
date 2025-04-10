const badge = (totalVentCoins) => {
    if (totalVentCoins >= 1 && totalVentCoins < 1000) {
        return "bronze";
    } else if (totalVentCoins >= 1000 && totalVentCoins < 2000) {
        return "silver";
    } else if (totalVentCoins >= 2000 && totalVentCoins < 3000) {
        return "gold";
    } else if (totalVentCoins >= 3000 && totalVentCoins <= 4000) {
        return "ruby";
    } else if (totalVentCoins >= 4000 && totalVentCoins <= 5000) {
        return "emerald";
    } else if (totalVentCoins >= 5000 && totalVentCoins <= 6000) {
        return "amethyst";
    } else if (totalVentCoins >= 6000 && totalVentCoins <= 7000) {
        return "diamond";
    } else if (totalVentCoins >= 7000 ) {
        return "pinkDiamond";
    } 
}

export default badge;