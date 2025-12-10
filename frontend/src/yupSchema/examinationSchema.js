import * as yup from 'yup';

export const examinationSchema = yup.object({
    date: yup.date().required("date is required"),
    subject: yup.string().required("Subject is required"),


    examType: yup.string().required("exam type is required"),

})