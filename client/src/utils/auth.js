import axios from 'axios';

var auth = {
    login(email, password, company_name) {
        if (this.loggedIn()) {
            return {error: false, message: 'You have been logged in.'};
        }
        return axios
                .post('/api/login', {email, password, company_name})
                .then(response => {
                    if (response && response.data.success) {
                        localStorage.token = response.data.token;
                    }
                    return response.data;
                })
                .catch(error => {
                    console.log(error);
                });
    },
    logout() {
        localStorage.removeItem('token');
        sessionStorage.removeItem('current_project');
    },
    loggedIn() {
        return !!localStorage.token;
    },
    register(company_name, email, username, password, confirm_password) {
        return axios
            .post('/api/register', {company_name, email, username, password, confirm_password})
            .then(response => {
                if (response && response.data.success) {
                    return this.login(email, password, company_name);
                }
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    }
};

export default auth;