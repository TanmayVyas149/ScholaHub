import * as yup from 'yup';

export const registerSchema = yup.object({
    school_name: yup.string().min(8,"School name must contain 8 characters .").required("School name is required ."),
    email: yup.string().email("it must be an email").required("Email is required"),
    owner_name: yup.string().min(3, "owner name must have 8 characters").required("It is required field ."),
    password: yup.string().min(8,"Password must contain 8 characters .").required("Password is a required field"), 
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], "Confirm Password must match with Password.")
    .required("Confirm Password is required.")
})

