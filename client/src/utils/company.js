import axios from 'axios';

var company = {
    getAllStaffTimeline(companyId, start_day, end_day) {
        return axios.get('/api/companies/allStaffTimeline/'+companyId,{
                params:{
                    start_day: start_day,
                    end_day: end_day
                },
                headers: { 'x-access-token': localStorage.token }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export default company;