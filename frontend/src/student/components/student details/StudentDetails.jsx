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

export default function StudentDetails() {

    const [studentDetails, setStudentDetails] = React.useState(null);

    const fetchStudentDetails = async () => {
        try {
            const response = await axios.get(`${baseapi}/student/fetch-single`);
            console.log("Student details", response.data);
            setStudentDetails(response.data.student);
        } catch (error) {
            console.log("Error fetching single student details");
        }
    };

    React.useEffect(() => {
        fetchStudentDetails();
    }, []);

    return (
        <>
            {studentDetails &&
                <>
                    <CardMedia
                        component="img"
                        sx={{ height: "230px", width: '310px', margin: 'auto', borderRadius: '50%' }}
                        image={`/images/uploaded/student/${studentDetails.student_image}`}
                        alt=""
                    />

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="student details table">
                            <TableBody>

                                <TableRow>
                                    <TableCell><b>Name:</b></TableCell>
                                    <TableCell align="right">{studentDetails.name}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell><b>Email:</b></TableCell>
                                    <TableCell align="right">{studentDetails.email}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell><b>Age:</b></TableCell>
                                    <TableCell align="right">{studentDetails.age}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell><b>Gender:</b></TableCell>
                                    <TableCell align="right">{studentDetails.gender}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell><b>Class:</b></TableCell>
                                    <TableCell align="right">{studentDetails.student_class.class_text}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell><b>Guardian:</b></TableCell>
                                    <TableCell align="right">{studentDetails.guardian}</TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
        </>
    );
}
