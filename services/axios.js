const axios = require('axios');

module.exports = (from_date, to_date) => {
    return new Promise((res, rej) => {
        let axiosData = {
            guid: 'FB057E6D-E772-4282-9BA4-F5B6334AA66D',
            from_date: from_date,
            to_date: to_date
        };
        axiosData = JSON.stringify(axiosData);
        let result = axios.post('https://betaapi.autoads.asia/PushNotification/api/contact/getcontacts', axiosData, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        });
        res(result);
    })
}