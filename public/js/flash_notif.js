let flash_notif = document.getElementById('flash_notif');
setTimeout(() => {
    if (flash_notif !== null) {
        flash_notif.style.display = 'none';
    }

}, 5000)