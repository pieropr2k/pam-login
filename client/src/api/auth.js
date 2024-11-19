import axios from "./axios";

export const registerRequest = async (user) => {
  console.log(user);
  return axios.post(`/auth/register`, user);

}
//  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => axios.post(`/auth/login`, user);

export const verifyTokenRequest = async () => axios.get(`/auth/verify`);
