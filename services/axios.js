const axios = require('axios');

module.exports = (from_date, to_date) => {
    return new Promise((res, rej) => {
        let axiosData = {};
        axiosData.guid = 'FB057E6D-E772-4282-9BA4-F5B6334AA66D';
        axiosData.from_date = from_date;
        axiosData.to_date = to_date;
        let Data = JSON.stringify(axiosData);

        let result = axios.post('https://betaapi.autoads.asia/PushNotification/api/contact/getcontacts', Data, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        });
        res(result);
    })
}