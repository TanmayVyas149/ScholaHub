import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React from "react";
import axios from "axios";
import { baseapi } from "../../../environment";
import CardMedia from '@mui/material/CardMedia';
export default function TeacherDetails() {
    const [teacherDetails, setTeacherDetails] = React.useState(null);
    const fetchTeacherDetails = async () => {
        try {
            const response = await axios.get(`${baseapi}/teacher/fetch-single`);
            console.log("Teacher details", response.data)
            setTeacherDetails(response.data.teacher)
        } catch (error) {
            console.log("Error in teacher deatils fetching single data")
        }

    }
    React.useEffect(() => {
        fetchTeacherDetails()
    }, [])
    return (
        <>
            {teacherDetails &&
            <>
            <CardMedia
        component="img"
        sx={{height:"230px",width:'310px', margin:'auto', borderRadius:'50%'}}
        image={`/images/uploaded/teacher/${teacherDetails.teacher_image}`}
        alt=""
      />
                
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">

                            <TableBody>
                                <TableRow>
                                    <TableCell><b>Name:</b>
                                    </TableCell>
                                    <TableCell align="right">{teacherDetails.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><b>Email:</b>
                                    </TableCell>
                                    <TableCell align="right">{teacherDetails.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><b>Age:</b>
                                    </TableCell>
                                    <TableCell align="right">{teacherDetails.age}</TableCell>

                                </TableRow>
                                <TableRow>
                                    <TableCell><b>Gender:</b>
                                    </TableCell>
                                    <TableCell align="right">{teacherDetails.gender}</TableCell>

                                </TableRow>
                                <TableRow>
                                    <TableCell><b>Qualification:</b>
                                    </TableCell>
                                    <TableCell align="right">{teacherDetails.qualification}</TableCell>

                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }

        </>
    );
}
