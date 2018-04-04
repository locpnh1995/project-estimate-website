import axios from 'axios';

var meeting = {
    getMessage(projectId, limit, offset) {
        return axios.get(`/api/chats/projects/${projectId}?limit=${limit}&offset=${offset}`, {
	        	headers: { 'x-access-token': localStorage.token }
    		})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
}

export default meeting;