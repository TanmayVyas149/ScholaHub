

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import Attendee from "./Attendee";
import { Link } from "react-router-dom";

import axios from "axios";
import { studentSchema, studentEditSchema } from "../../../yupSchema/studentSchema";
import { baseapi } from "../../../environment";
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));
export default function AttendanceStudentList() {
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
 
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [params, setParams] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch classes
  const fetchClasses = () => {
    axios.get(`${baseapi}/class/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(resp => setClasses(resp.data.data))
      .catch(e => console.log("Error fetching classes:", e));
  };

  // Fetch students
  const fetchStudents = () => {
    axios.get(`${baseapi}/student/fetch-with-query`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(resp => setStudents(resp.data.students))
      .catch(e => console.log("Error fetching students:", e.response?.data || e.message));
  };
  const [attendanceData, setAttendanceData] = useState({});
  const fetchAttendanceForStudents = async (studentsList)=>{
    const attendancePromises = studentsList.map((student)=>
    fetchAttendanceForStudent(student._id)
    );
    const results = await Promise.all(attendancePromises);
    const updatedAttendanceData = {};
    results.forEach(({studentId, attendancePercentage})=>{
      updatedAttendanceData[studentId] = attendancePercentage;
    })
  }
const fetchAttendanceForStudent = async(studentId)=>{
  try{
  const response = await axios.get(`${baseapi}/attendance/${studentId}`);
  const attendanceRecords = response.data;
  const totalClasses = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(
    (record) => record.status === "Present"
  ).length;
  const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses)* 100 : 0;
  return { studentId, attendancePercentage } ;
 
} catch (error) {
  console.log(`Error fetching attendance for student ${studentId}:`,error);
  return { studentId, attendancePercentage: 0 } ;
}
}
  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    
    fetchStudents();
  }, [params, message]);




  const handleMessageClose = () => setMessage('');
const handleMessage = (message, type)=>{
  setMessageType(type);
  setMessage(message)
}

  const handleClassFilter = (e) => {
    setSelectedClass(e.target.value)
    setParams(prev => ({ ...prev, student_class: e.target.value || undefined }));
  };

  const handleSearch = (e) => {
    setParams(prev => ({ ...prev, search: e.target.value || undefined }));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 4 }}>

      {message && <MessageSnackbar message={message} type={messageType} handleClose={handleMessageClose} />}
    <Typography variant = "h4" sx={{textAlign:"center"}}>Students Attendance</Typography>
     <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 4 }}>
          <Item>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
        <TextField label="Search" value={params.search || ""} onChange={handleSearch} size="small" />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select Class</InputLabel>
          <Select value={params.student_class || ""} onChange={handleClassFilter}>
            <MenuItem value="">All Classes</MenuItem>
            {classes.map(x => <MenuItem key={x._id} value={x._id}>{x.class_text} ({x.class_num})</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <Box>
       {selectedClass && <Attendee classId={selectedClass} handleMessage={handleMessage}  message={message} />}

      </Box>
          </Item>
        </Grid>
        <Grid size={{ xs: 6, md: 8 }}>
          <Item>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Gender</TableCell>
            <TableCell align="right">Guardian Phone</TableCell>
            <TableCell align="right">Class</TableCell>
            <TableCell align="right">Percentage</TableCell>
              <TableCell align="right">View</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students && students.map((student) => (
            <TableRow
              key={student._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {student.name}
              </TableCell>
               <TableCell align="right">{student.gender}</TableCell>
              <TableCell align="right">{student.guardian_phone}</TableCell>
              <TableCell align="right">{student.student_class.class_text}</TableCell>
              <TableCell align="right">{attendanceData[student._id] !== undefined
                ? `${attendanceData[student._id].toFixed(2)}%`
                : "No data"
              }</TableCell>
              <TableCell align="right"><Link to={`/school/attendance/${student._id}`}>Details</Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </Item>
        </Grid>
       
      </Grid>
     
      

    </Box>
  );
}
