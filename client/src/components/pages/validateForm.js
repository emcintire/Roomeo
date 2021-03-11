// export default function validateInfo(state) {
//     let errors = {};
  
//     if (!state.name.trim()) {
//       errors.name= 'Name required';
//     }
//     // else if (!/^[A-Za-z]+/.test(values.name.trim())) {
//     //   errors.name = 'Enter a valid name';
//     // }
  
//     if (!state.email) {
//       errors.email = 'Email required';
//     } else if (!/\S+@\S+\.\S+/.test(state.email)) {
//       errors.email = 'Email address is invalid';
//     }
//     if (!state.password) {
//       errors.password = 'Password is required';
//     } else if (state.password.length < 6) {
//       errors.password = 'Password needs to be 6 characters or more';
//     }
  
//     if (!state.confirmPassword) {
//       errors.confirmPassword = 'Password is required';
//     } else if (state.confirmPassword !== state.password) {
//       errors.confirmPassword = 'Passwords do not match';
//     }
//     return errors;
//   }