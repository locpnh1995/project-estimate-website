import axios from 'axios';

var project = {
    newProject(projectInfo) {
        return axios.post('/api/projects/', projectInfo,
                 {headers: { 'x-access-token': localStorage.token }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    getProjectById(projectId) {
        return axios.get('/api/projects/' + projectId,
                 {headers: { 'x-access-token': localStorage.token }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    getProjectBelongUser() {
        return axios.get('/api/projects/', {
                headers: {
                    'x-access-token': localStorage.token
                }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    getUserReplace(users, projectID) {
        return axios.post('/api/users/user_replace/', {users, projectID}, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        });
    }
}

export default project;