let edit = () => {
    let profile_fields = document.getElementsByClassName('profile_fields');
    for (i = 0; i < profile_fields.length; i++) {
        profile_fields[i].style.display = "block";
    }
}
let cancel_edit = () => {
    let profile_fields = document.getElementsByClassName('profile_fields');
    for (i = 0; i < profile_fields.length; i++) {
        profile_fields[i].style.display = "none";
    }
}