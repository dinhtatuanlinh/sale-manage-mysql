// const cookie = require(cookie);
// import cookie from "cookie";

if (window.location.pathname !== "/login") {
    let menuID = getCookie("menu");
    if (menuID === "") {
        let seletedMenu = document.getElementById('index');
        seletedMenu.style.background = "#000";
    } else {
        let seletedMenu = document.getElementById(menuID);
        seletedMenu.style.background = "#000";
    }
}

let changeMenuColor = (element) => {
    console.log(element.id);
    setCookie("menu", element.id, 5 / (24 * 60));
};