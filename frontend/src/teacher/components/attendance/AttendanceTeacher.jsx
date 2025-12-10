import { useEffect } from "react"
import axios from "axios";
import React from "react";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { baseapi } from "../../../environment";
import { useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
export default function AttendanceTeacher() {
  const [selectedClass, setSelectedClass] = useState("")
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({})
     const [message, setMessage] = useState("");
      const [messageType, setMessageType] = useState("success");
      const handleMessageClose = () => setMessage("");
  // const fetchAttendeeClass = async () => {

  //   try {
  //     const respone = await axios.get(`${baseapi}/class/attendee`);
  //     console.log(respone.data)
  //     setClasses(respone.data.data)
  //     if (respone.data.data.length > 0) {
  //       setSelectedClass(respone.data.data[0]._id)
  //     }
  //   } catch (error) {
  //     console.log("Error=> fetching students", error)
  //   }
  // }
  const handleAttendance=(studentId, status)=>{
    setAttendanceStatus((prevStatus)=>({
      ...prevStatus,
      [studentId]:status
    })

    )
  }
    
  const singleStudentAttendance = async(studentId, status )=>{
    try {
      //studentId, date, status, classId
      const response = await axios.post('${baseapi}/attendance/mark',{studentId, date: new Date(), classId:selectedClass, status});
      console.log("marking attendance",response)
    } catch (error) {
      console.log("ERROR=>marking Attendee class.",error)
    }
  }

  const submitAttendance=async()=>{
    try {
      await Promise.all(students.map((student)=>{
        singleStudentAttendance(student._id, attendanceStatus(student._id))
      }))
      setMessage("Attendance Submitted successfully")
      setMessageType("success")
    } catch (error) {
        setMessage("Failed Attendance submittion")
        setMessageType("error")
            console.log("ERROR=> All submit error marking Attendee class.",error)
    }
  }
  const fetchAttendeeClass = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN =>", token);

    const response = await axios.get(`${baseapi}/class/attendee`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("CLASS RESPONSE =>", response.data);

    setClasses(response.data.data);

    if (response.data.data.length > 0) {
      setSelectedClass(response.data.data[0]._id);
    }
  } catch (error) {
    console.log("Error => fetching attendee class", error);
  }
};


  // Fetch students
  useEffect(() => {

    fetchAttendeeClass();
  }, [])
  const [attendanceChecked, setAttendanceChecked] = useState(false)
  const checkAttendanceFetchStudents = async()=>{
   
    try {
       if(selectedClass){
        const responseStudent =  await axios.get(`${baseapi}/student/fetch-with-query`, {

      params: { student_class: selectedClass },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      const respnseCheck = await axios.get(`${baseapi}/attendance/check/${selectedClass}`)
      console.log("Check ", respnseCheck)
      if(!respnseCheck.data.attendanceTaken){
          setStudents(responseStudent.data.students)
      responseStudent.data.students.forEach(student=>{
        handleAttendance(student._id,'present')
      }) 
      }else{
        setAttendanceChecked(true)
      }
        
    }
    } catch (error) {
      console.log("Error in check attendance",error)
    }
  }

  useEffect(() => {
   checkAttendanceFetchStudents()
  //  fetchAttendeeClass();
  }, [selectedClass, message])
  return (
    <>
       {message && (
                    <MessageSnackbar
                        message={message}
                        type={messageType}
                        handleClose={handleMessageClose}
                    />
                )}
      <h1>AttendanceTeacher</h1>
      {classes.length > 0 ? <Paper sx={{ marginBottom: "10px" }}>
        <Box>
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            You are attendee of {classes.length} classes.
          </Alert>
          <FormControl sx={{ marginTop: "10px", minWidth: "210px" }}>
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
              name="class"
              onChange={(e) => { setSelectedClass(e.target.value) ; setAttendanceChecked(false)}}
              value={selectedClass}
              label="Class"

              id="filled-basic"
            >
              <MenuItem value="">Select Class</MenuItem>
              {classes.map(x => {
                return (<MenuItem key={x._id} value={x._id}>{x.class_text}</MenuItem>)
              })}

            </Select>
          </FormControl>
        </Box>
      </Paper> : <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
        You are not attendee of any classes.
      </Alert>}
    
      {(students.length > 0 && !attendanceChecked) ? <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='right'><b>Name</b></TableCell>
              <TableCell align="right"><b>Action</b></TableCell>



            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='right' component="th" scope="row">
                 {student.name}
                </TableCell>

                <TableCell align="right">
                
                  <FormControl sx={{ marginTop: "10px", minWidth: "210px" }}>
                   <InputLabel>Attendance</InputLabel>
                    <Select
                      
                      onChange={(e) => { handleAttendance(student._id,e.target.value) }}
                      value={attendanceStatus[student._id]}
                      label="Attendance"

                      id="filled-basic"
                    >
                      <MenuItem value={"present"}>Present</MenuItem>
                     <MenuItem value={"absent"}>Absent</MenuItem>

                    </Select>
                  </FormControl>
                </TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" onClick={handleAttendance} >Take Attendance</Button>
      </TableContainer> :<>
         <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
      { attendanceChecked? 'Attendance Already taken for this class':'There is no student in this class.'}
      </Alert>
   
      </>}
    </>
  )
}