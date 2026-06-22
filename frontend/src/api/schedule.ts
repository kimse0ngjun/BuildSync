import axios from "axios";
import type {
  Schedule,
  ScheduleRequest
} from "../types/schedule";


const API_URL = import.meta.env.VITE_API_URL;


const getAuthHeader = () => {

  const token = localStorage.getItem("token");

  return {
    Authorization:`Bearer ${token}`
  };
};



export const getSchedules = () => {

 return axios.get<Schedule[]>(
   `${API_URL}/api/schedules`,
   {
    headers:getAuthHeader()
   }
 );

};



export const getSchedule = (
 id:number
)=>{

 return axios.get<Schedule>(
  `${API_URL}/api/schedules/${id}`,
  {
   headers:getAuthHeader()
  }
 );

};



export const createSchedule = (
 data:ScheduleRequest
)=>{

 return axios.post(
  `${API_URL}/api/schedules`,
  data,
  {
   headers:getAuthHeader()
  }
 );

};



export const updateSchedule = (
 id:number,
 data:ScheduleRequest
)=>{

 return axios.put(
  `${API_URL}/api/schedules/${id}`,
  data,
  {
   headers:getAuthHeader()
  }
 );

};



export const deleteSchedule = (
 id:number
)=>{

 return axios.delete(
  `${API_URL}/api/schedules/${id}`,
  {
   headers:getAuthHeader()
  }
 );

};