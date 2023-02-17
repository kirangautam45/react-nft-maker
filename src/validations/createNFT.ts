import * as yup from 'yup';

export const createNFTValidation = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  // category: yup.string().required('Category is required'),
});
