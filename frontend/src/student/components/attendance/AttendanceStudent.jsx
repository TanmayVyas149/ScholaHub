
import { PieChart } from '@mui/x-charts/PieChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { baseapi } from "../../../environment"
import axios from "axios";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

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

export default function AttendanceStudent() {
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0)
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentId, setStudentId] = useState(null)
  
  const convertDate = (dateData)=>{
    const date = new Date(dateData);
    return date.getDate() + "-"+ (date.getMonth()+1) + "-" + date.getFullYear();
  }

    const fetchStudentDetails = async () => {
          try {
              const response = await axios.get(`${baseapi}/student/fetch-single`);
              console.log("Student details", response.data);
              // setStudentDetails(response.data.student);
             // setSelectedClass(response.data.student.student_class)
             setStudentId(response.data.student._id)
          } catch (error) {
              console.log("Error fetching single student details");
          }
      };
  useEffect(()=>{
    fetchStudentDetails()
  },[])
  
  const fetchAttendanceData = async() => {
    try {
       const response = await axios.get(`${baseapi}/attendance/${studentId}`);
   // const response = await axios.get(`${baseapi}/attendance/fetch-with-student/${studentId}`);

      console.log("RESPONSE ATTENDANCE", response);
      setAttendanceData(response.data);
      const respData = response.data;
     
      if(respData){
         console.log("RESPDATA ",respData)
      respData.forEach(attendance=>{
        if(attendance.status == 'present'){
          setPresent((prev)=>prev+1);
        }else if(attendance.status == 'absent'){
          setAbsent((prev)=>prev+1);
        }
      })
    }
    } catch (error) {
      console.log("error in fetching student attendance", error);
     
    }
  };

  // useEffect(() => {
    
  //     fetchAttendanceData();
    
  // }, []);
 useEffect(() => {
    if (studentId) {
      fetchAttendanceData(); // ✔ Correct call
    }
  }, [studentId]);
  return (
    <>
      <h1>Attendance Details</h1>
       <Grid container spacing={2}>
        <Grid size={6}>
          <Item>
        <PieChart
      series={[
        {
          data: [
            { id: 0, value: present, label: 'Present' },
            { id: 1, value: absent, label: 'Absent' },
           
          ],
        },
      ]}
      width={200}
      height={200}
    />
          </Item>
        </Grid>
        <Grid size={6}>
          <Item>
             <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Status</TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceData.map((attendance) => (
            <TableRow
              key={attendance._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {convertDate(attendance.date)}
              </TableCell>
              <TableCell align="right">{attendance.status}</TableCell>
           
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </Item>
        </Grid>
       
      </Grid>
    </>
  );
}
