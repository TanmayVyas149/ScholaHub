
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

import axios from "axios";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import { baseapi } from '../../../environment';

moment.tz.setDefault("Asia/Kolkata");
const localizer = momentLocalizer(moment);

export default function ScheduleStudent() {


    const [selectedClass, setSelectedClass] = useState(null);
    const date = new Date();

    const myEventsList = [
        {
            id: 1,
            title: "Subject: History, Teacher: Ram",
            start: new Date(2025, 0, 1, 11, 30),
            end: new Date(2025, 0, 1, 14, 30),
        },
    ];
    const [events, setEvents] = useState(myEventsList)


    const [selectedEventId, setselectedEventId] = useState(null);

    const fetchStudentDetails = async () => {
        try {
            const response = await axios.get(`${baseapi}/student/fetch-single`);
            console.log("Student details", response.data);
            // setStudentDetails(response.data.student);
            setSelectedClass(response.data.student.student_class)
        } catch (error) {
            console.log("Error fetching single student details");
        }
    };

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    useEffect(() => {
        if (selectedClass) {
console.log("SELECTED ",selectedClass)
            axios
                .get(`${baseapi}/schedule/fetch-with-class/${selectedClass._id}`)
                .then((resp) => {

                    console.log(resp.data.data)
                    const respData = resp.data.data.map(x => {
                        return (
                            {
                                id: x._id,
                                title: `Sub: ${x.subject.subject_name}, teacher: ${x.teacher.name}`,
                                start: new Date(x.startTime),
                                end: new Date(x.endTime)
                            }
                        )
                    })
                    setEvents(respData);
                })
                .catch((e) => console.log("Error in fetching Schedule", e));
        }
    }, [selectedClass]);

    return (
        <>

            <FormControl  >
                <Typography variant="h5">Schedule of your Class [{selectedClass ? selectedClass.class_text : ""}]</Typography>

            </FormControl>

            <Calendar
                localizer={localizer}
                events={events}
                defaultView="week"
                views={["week", "day", "agenda"]}
                step={30}
                timeslots={1}
                min={new Date(1970, 1, 1, 10, 0)}
                max={new Date(1970, 1, 1, 17, 0)}

                style={{ height: "600px", width: "100%" }}
            />
        </>
    );
}
