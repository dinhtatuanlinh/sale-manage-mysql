if (document.getElementById('admin') !== null) {

}
let role = (element, id, url) => {
    sendajax('role', element.value, id, url)

}
let status = (element, id, url) => {
    sendajax('status', element.value, id, url)
}
let manager = (element, id, url) => {
    sendajax('manager', element.value, id, url)
}
let sendajax = (param, value, id, url) => {
    let data = { id: id, value: value }
    data = JSON.stringify(data);
    let Dia_chi_Xu_ly = `http://${url}/admin/properties/${param}`;
    // console.log(data);
    // console.log(Dia_chi_Xu_ly);
    let XHTTP = new XMLHttpRequest() || ActiveXObject();
    XHTTP.open("POST", Dia_chi_Xu_ly, false);
    XHTTP.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    // XHTTP.open("POST", Dia_chi_Xu_ly, false);
    XHTTP.send(data);
    var backData = XHTTP.responseText;
    if (backData) {
        location.reload();
    }
}