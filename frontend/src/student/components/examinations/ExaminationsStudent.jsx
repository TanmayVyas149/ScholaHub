import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import React from "react";
import { useEffect, useState } from "react"
import { baseapi } from "../../../environment";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import { Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { selectClasses } from '@mui/material/Select';
import { examinationSchema } from '../../../yupSchema/examinationSchema';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import axios from "axios";
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';

export default function ExaminationsStudent() {
  const [selectedClass, setSelectedClass] = React.useState("") 
  const [examinations, setExamination] = React.useState([]);
  const [subjects,setSubjects] = React.useState([])
//    const [message, setMessage] = React.useState('');
//       const [messageType, setMessageType] = React.useState('success');
//       const handleMessageClose = () => setMessage('');
//       const handleMessageNew = (msg, type) => {
//           setMessage(msg)
//           setMessageType(type)
//       }
          const dateFormat = (dateData) => {
            const date = new Date(dateData)
        const dateHours = date.getHours();
        const dateMinutes = date.getMinutes()
        return date.getDate()+"-"+(+date.getMonth()+1)+"-"+date.getFullYear()
    }
  const initialValues = {
    date: "",
    subject: "",
    examType: ""
  }


  
  const fetchExaminations = async()=>{
    try {
      if(selectedClass){
      const response = await axios.get(`${baseapi}/examination/class/${selectedClass}`)
      setExamination(response.data.examinations)
    }
    } catch (error) {
         console.log("ERROR=>Saving new examination - Examination Component", error);
    }
  }
//   const [editId, setEditId] = React.useState(null);
//   const handleEdit = (id)=>{
//     setEditId(id);
//     const selectedExamination = examinations.filter(x=>x._id===id)
//     // Formik.setFieldValue("date",selectedExamination[0].examDate);
//     Formik.setFieldValue("date", dayjs(selectedExamination[0].examDate));
//     Formik.setFieldValue("subject",selectedExamination[0].subject._id)
//      Formik.setFieldValue("examType",selectedExamination[0].examType)
//   }

    const handleDelete = async(id)=>{
    if(confirm("Are you sure you want to delete ? ")){
      try {
        const response = await axios.delete(`${baseapi}/examination/delete/${id}`);
        console.log("DELETE",response)
        setMessage(response.data.message)
        setMessageType("success")
      } catch (error) {
        setMessage("Error in deleting  examination");
        setMessageType("error");
        console.log("ERROR=>Saving deleting examination - Examination Component", error)
      }
    }
  }

//   const handleEditCancel = () =>{
//     setEditId(null);
//     Formik.resetForm()
//   }
  // React.useEffect(()=>{
  //   fetchClasses();
  // },[])
  // React.useEffect(()=>{
  //   fetchExaminations();
  //   fetchSubjects();
    
  // },[message])
  const [className, setClassName] = useState('')

    const fetchStudentDetails = async () => {
          try {
              const response = await axios.get(`${baseapi}/student/fetch-single`);
              console.log("Student details", response.data);
              // setStudentDetails(response.data.student);
             // setSelectedClass(response.data.student.student_class)
             setSelectedClass(response.data.student.student_class._id);
             setClassName(response.data.student.student_class.class_text)
          } catch (error) {
              console.log("Error fetching single student details");
          }
      };
  useEffect(()=>{
    fetchStudentDetails()
  },[])  // runs once on mount

React.useEffect(() => {
  fetchExaminations();
}, [selectedClass]); 

  
  return (
    <>
    <Typography>Examination of your Class [{className}]</Typography>
   
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='right'><b>Exam Date</b></TableCell>
              <TableCell align="right"><b>Subject</b></TableCell>
              <TableCell align="right"><b>Exam type</b></TableCell>
             

            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.map((examination) => (
              <TableRow
                key={examination._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='right' component="th" scope="row">
                  {dateFormat((examination.examDate))}
                </TableCell>
                <TableCell align="right">{examination.subject? examination.subject.subject_name:""}</TableCell>
                <TableCell align="right">{examination.examType}</TableCell>
                
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
