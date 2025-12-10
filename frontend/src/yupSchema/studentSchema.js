import * as yup from 'yup';

export const studentSchema = yup.object({
    name: yup.string().min(3, "Student name must contain 3 characters").required("Student name is required"),
    email: yup.string().email("it must be an email").required("Email is required"),
    student_class: yup.string().required("Student Class is required field"),
    age: yup.string().required("Age is required field"),
    gender: yup.string().required("Gender is required field"),
    guardian: yup.string().min(4, "Must contain 4 characters").required("guardian is required field"),
    guardian_phone: yup.string().min(9, "Must contain 9 charcters").max(11, "Can't extend 11 characters"),
    password: yup.string().min(8, "Password must contain 8 characters .").required("Password is a required field"),
    confirm_password: yup.string().oneOf([yup.ref('password'), null], "Confirm Password must match with Password.").required("Confirm Password is required.")
})
export const studentEditSchema = yup.object({
    school_name: yup.string().min(8,"School name must contain 8 characters .").required("School name is required ."),
    email: yup.string().email("it must be an email").required("Email is required"),
    owner_name: yup.string().min(3, "owner name must have 8 characters").required("It is required field ."),
    password: yup.string().min(8,"Password must contain 8 characters .") ,
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], "Confirm Password must match with Password.")
    
})
