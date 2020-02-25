//
// wrapper around axios to include Rails CSRF token
//
import axios from 'axios'

const token = document.querySelector('[name="csrf-token"]') || {content: 'no-csrf-token'};
console.log("token", token);
const ax = axios.create({
    headers: {
        common: {
            'X_REQUESTED_WITH': 'XMLHttpRequest',
            'X-CSRF-Token': token.content
        }
    }
});

ax.interceptors.response.use(function (response) {
    console.log("------------- axios response -----------------", response);
    // Do something with response data
    return response;
}, function (error) {
    console.log("------------- axios error -----------------", error);
    // Do something with response error
    return Promise.reject(error);
});

export default ax
