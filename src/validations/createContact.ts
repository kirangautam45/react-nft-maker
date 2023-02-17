import * as yup from 'yup';

export const createContactValidation = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required(),
  phone: yup.string().min(9).required('Phone is Required'),
});
