
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
// import ScheduleEvent from "./ScheduleEvent";
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

export default function ScheduleTeacher() {
  //  const [newPeriod, setNewPeriod] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    // const [message, setMessage] = useState('');
    // const [messageType, setMessageType] = useState('success');
    // const handleMessageClose = () => setMessage('');
    // const handleMessageNew = (msg, type) => {
    //     setMessage(msg)
    //     setMessageType(type)
    // }

    const myEventsList = [
        {
            id: 1,
            title: "Subject: History, Teacher: Ram",
            start: new Date(2025, 0, 1, 11, 30),
            end: new Date(2025, 0, 1, 14, 30),
        },
    ];
    const [events, setEvents] = useState(myEventsList)

    const [edit,setEdit] = useState(false)
    // const handleEventClose = () => {
    //     setNewPeriod(false);
    //     setEdit(false)
    //     setselectedEventId(null)
    // }
    const [selectedEventId, setselectedEventId] = useState(null);
    // const handleSelectEvent = (event) => {
    //     //console.log(event)
    //     setEdit(true)
    //     setselectedEventId(event.id)
    // }
    useEffect(() => {
        axios
            .get(`${baseapi}/class/all`)
            .then((resp) => {
                setClasses(resp.data.data);
                //  console.log(resp.data.data)
                setSelectedClass(resp.data.data[0]._id)
            })
            .catch((e) => {
                console.log("Fetch class Err", e);
            });
    }, []);
    // useEffect(()=>{
    //     if(selectedClass){
    //          axios.get(`${baseapi}/schedule/fetch-with-class/${selectedClass}`).then(resp=>{
    //             console.log(resp.data.data)
    //             const respData = resp.data.data.map(x=>{
    //                 return ({id:x._id,
    //                     title:`Sub:${x.subject.subject_name}, teacher:${x.teacher.name}`,
    //                     start: new Date(x.startTime),
    //                     end : new Date(x.endTime)
    //                 })
    //             })
    //        console.log(selectedClass)
    //       //  setEvents(resp.data.data)

    //     setEvents(respData);
    //     }).catch(e=>{
    //         console.log("Error in fetching Schedule",e)
    //     })
    //     }

    // },[selectedClass])
    useEffect(() => {
        if (selectedClass) {

            axios
                .get(`${baseapi}/schedule/fetch-with-class/${selectedClass}`)
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
            {(
                <MessageSnackbar
                    // message={message}
                    // type={messageType}
                    // handleClose={handleMessageClose}
                />
            )}
            <FormControl  >
                <Typography variant="h5">Class</Typography>
                <Select

                    value={selectedClass || ""}
                    // label="Class"
                    onChange={(e) => {
                        setSelectedClass(e.target.value)
                    }}
                >
                    {classes &&
                        classes.map((x) => {
                            return (
                                <MenuItem key={x._id} value={x._id}>
                                    {x.class_text}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>

            {/* BUTTON TO OPEN MODAL */}
            {/* <Button onClick={() => setNewPeriod(true)}>Add new Period</Button> */}

            {/* {(newPeriod  || edit) && <ScheduleEvent selectedClass={selectedClass} handleEventClose={handleEventClose} handleMessageNew={handleMessageNew} edit={edit} selectedEventId={selectedEventId}/>} */}

            {/* WEEKLY CALENDAR */}
            <Calendar
                localizer={localizer}
                events={events}
                defaultView="week"
                views={["week", "day", "agenda"]}
                step={30}
                timeslots={1}
                min={new Date(1970, 1, 1, 10, 0)}
                max={new Date(1970, 1, 1, 17, 0)}
                //defaultDate={new Date(2025, 0, 1)}
                //  defaultDate={events[0]?.start || new Date()}
                // defaultDate={new Date()}
                      //  onSelectEvent={handleSelectEvent}
                style={{ height: "600px", width: "100%" }}
            />
        </>
    );
}


