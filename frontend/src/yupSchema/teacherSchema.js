import * as yup from 'yup';


export const teacherSchema = yup.object({
    name: yup.string().min(3, "teacher name must contain 3 characters").required("Student name is required"),
    email: yup.string().email("it must be an email").required("Email is required"),
    age: yup.string().required("Age is required field"),
    gender: yup.string().required("Gender is required field"),
    qualification: yup.string().min(4, "Must contain 4 characters").required("qualification is required field"),
    password: yup.string().min(8, "Password must contain 8 characters .").required("Password is a required field"),
    confirm_password: yup.string().oneOf([yup.ref('password'), null], "Confirm Password must match with Password.").required("Confirm Password is required.")
})
export const teacherEditSchema = yup.object({
    name: yup.string().min(3, "Student name must contain 3 characters").required("Student name is required"),
    email: yup.string().email("it must be an email").required("Email is required"),
    age: yup.string().required("Age is required field"),
    gender: yup.string().required("Gender is required field"),
    qualification: yup.string().min(4, "Must contain 4 characters").required("qualification is required field"),
    password: yup.string().min(8, "Password must contain 8 characters ."),
    confirm_password: yup.string().oneOf([yup.ref('password'), null], "Confirm Password must match with Password.")

})
