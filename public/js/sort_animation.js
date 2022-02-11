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
            height: 200,
            duration: 1
        });
        gsap.fromTo("#sort_icon", {
            top: -22,
        }, {
            top: 180,
            duration: 1
        });

    }
    if (check === '1') {
        element.dataset.openclose = '0';
        icon.classList.add("fa-filter");
        icon.classList.remove("fa-times");
        gsap.fromTo("#sort", {

            height: 200,

        }, {
            height: 0,

            duration: 1
        });
        gsap.fromTo("#sort_icon", {
            top: 180,
        }, {
            top: -22,
            duration: 1
        });

    }
}
let statusCheck = document.getElementsByClassName("statusCheck");
let statusQuery = '';
let statusCheckFunc = ()=>{

    statusQuery = '';
    for(i=0; i<statusCheck.length; i++){
        if(statusCheck[i].checked){
            
            statusQuery += statusCheck[i].value + '-';
        }
    }
    statusQuery = statusQuery.slice(0, -1);
}
let filterFunc =(url, webQuery, dateQuery)=>{
    statusCheckFunc()
    window.location.replace(`https://${url}?ss=${statusQuery}&web=${webQuery}&time=${dateQuery}`);
}
let selectWeb = (e, sendStatusQuery, url, dateQuery)=>{
    window.location.replace(`https://${url}?web=${e.value}&ss=${sendStatusQuery}&time=${dateQuery}`)
}

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum;
 }
let filterDate = (url, sendStatusQuery, webQuery)=>{
    let dateFrom = document.getElementById('dateFrom');
    let dateTo = document.getElementById('dateTo');

    if(dateFrom.value && dateTo.value && toTimestamp(dateFrom.value)< Date.now()){

        let time = `${toTimestamp(dateFrom.value)}-${toTimestamp(dateTo.value)}`

        window.location.replace(`https://${url}?time=${time}&ss=${sendStatusQuery}&web=${webQuery}`)
    }else{
        alert('dữ liệu chưa đúng')
    }
    
}
let search = (e, url, sendStatusQuery, webQuery, dateQuery) =>{
    window.location.replace(`https://${url}?search=${e.value}&ss=${sendStatusQuery}&web=${webQuery}&time=${dateQuery}`)
}