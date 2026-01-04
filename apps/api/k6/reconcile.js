import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s'
};

export default function () {
  const id = `inv_${Math.floor(Math.random() * 1000)}`;
  const payload = JSON.stringify({ version: 1 });
  const res = http.post(`http://localhost:4000/disputes/${id}/reconcile`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
