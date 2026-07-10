import http from 'k6/http';
import {Counter} from 'k6/metrics'
import { Trend } from "k6/metrics";

const successTime = new Trend("success_time");
const blockedTime = new Trend("blocked_time");

const success200 = new Counter("success_200");
const blocked429 = new Counter("blocked_429");

export const options = {
    vus: 100,
    duration: '10s',
};

export default function () {
    const res = http.get('http://localhost:3000/');
    if(res.status === 200){
        success200.add(1);
        successTime.add(res.timings.duration);
    }

    if(res.status === 429){
        blocked429.add(1);
        blockedTime.add(res.timings.duration);
    }
}