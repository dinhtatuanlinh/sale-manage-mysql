let sort_open_close = (element) => {
    var check = element.dataset.openclose;

    var icon = element.getElementsByTagName('i')[0];
    console.log(icon);
    if (check === '0') {
        element.dataset.openclose = '1';
        icon.classList.remove("fa-filter");
        icon.classList.add("fa-times");
        gsap.fromTo("#sort", {

            height: 0, //normal value

        }, {
            height: 50,
            duration: 1
        });
        gsap.fromTo("#sort_icon", {
            top: -22,
        }, {
            top: 28,
            duration: 1
        });

    }
    if (check === '1') {
        element.dataset.openclose = '0';
        icon.classList.add("fa-filter");
        icon.classList.remove("fa-times");
        gsap.fromTo("#sort", {

            height: 50,

        }, {
            height: 0,

            duration: 1
        });
        gsap.fromTo("#sort_icon", {
            top: 28,
        }, {
            top: -22,
            duration: 1
        });

    }
}