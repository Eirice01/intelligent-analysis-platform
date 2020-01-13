import axios from 'axios';

export const getLogData =  (params={
    page:0,
    size:10
}) => axios({
    method:'get',
    headers:{'use-mock-service':false},
    url:'/api/log/logmonitor/logList',
    params,   
}).then(res => res.data);