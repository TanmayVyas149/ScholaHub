import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';
import "react-big-calendar/lib/css/react-big-calendar.css";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
axios.interceptors.request.use((request)=>{
  if(localStorage.getItem("token")){
    request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return request;
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <App />
    </LocalizationProvider>
  </StrictMode>,
)
