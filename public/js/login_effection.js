if (document.getElementById('login') !== null) {
    document.getElementById("registerPassword").value = '';
    document.getElementById("registerRepassword").value = '';
    document.getElementsByTagName("body")[0].style.height = '100vh';
    document.getElementsByTagName("body")[0].style.justifyContent = 'center';
    document.getElementsByTagName("body")[0].style.alignItems = 'center';
    document.getElementsByTagName("body")[0].style.flexDirection = 'column';
};

var inputPassword = (element, id) => {
    var hiddenInput = document.getElementById(id);
    hiddenInput.value = MD5(element.value);
    if (document.getElementById("registerPassword").value !== '') {
        document.getElementById("inputRepassword").disabled = false;
    }
    if (id === 'registerRepassword' && document.getElementById("registerRepassword").value !== document.getElementById("registerPassword").value) {
        document.getElementById("notice").innerHTML = "Chưa khớp với password";
    } else {
        document.getElementById("notice").innerHTML = '';
    }
};
var register = () => {
    document.getElementById("login").classList.add("hide");
    document.getElementById("register").classList.remove("hide");
    if (document.getElementById("registerPassword").value === '') {
        document.getElementById("inputRepassword").disabled = true;
    }
};
let login = () => {
    document.getElementById("register").classList.add("hide");
    document.getElementById("login").classList.remove("hide");
}