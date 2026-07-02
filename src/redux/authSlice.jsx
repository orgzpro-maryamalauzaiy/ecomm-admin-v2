import { useNavigate } from 'react-router-dom';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
// import Header from 'components/Headers/Header';

let initialState = {
    error: false,
    errorMessage: null,
    loading: false,
    userInfo: {
      email: ""
      // full_name: "",
      // uni: "",
      // is_admin: ""
    },
    userEmail: null
}

const BASE_URL = import.meta.env.VITE_SERVER_MODE === 'development' ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL

// const initialState = {
//   entities: [],
//   loading: false,
// }

export const login = createAsyncThunk(
  '/auth/login',
  async (data, {rejectWithValue}) => {
    await axios.post(`${BASE_URL}/auth/login`, data)
          .then(result => {
            console.log('result', result.data.data.email, result.status === 200)
            if(result.status === 200){

              console.log('result', result)

              Cookies.set('token', result.data.data.token)


              initialState.userEmail = result.data.data.email

              console.log('initialState', initialState, result.data.data.email)

              console.log('initialState', initialState, result.data.data.email)


              // Cookies.set('token', result.data.data.token)
              // this.iniatialState.userInfo = {
              //   full_name: result.data.data.full_name,
              // }
              // this.initialState.orgzInfo.orgz_id= result.data.data.orgz_id
              // this.initialState.orgzInfo.orgz_name= result.data.data.orgz_id
              //   ,
              //   org_name: result.data.data.orgz_name,
              // }
              // toast('Alhamdulillah, Anda berhasil login.')
              return result.data.data
            }else{

              console.log('initialState', initialState, result.data.data.email)

              console.log('initialState', initialState, result.data.data.email)

              initialState.userEmail = null
              initialState.userInfo = null


              return rejectWithValue(result.data.data.message)
            }
          })
          .catch(error => {
            console.log(error)
            // toast('Afwan, Error ketika login.')
            // this.state.error = true
            // this.state.errorMessage = 'Persist login error: ' + error

            return rejectWithValue(error)

          })
    // const res = await fetch(`${BASE_URL}/api/auth/login`).then(
    //   (data) => data.json()
    // )
    // return res
})
export const logout_ = createAsyncThunk(
  '/auth/logout',
  async (data) => {
    await axios.post(`${BASE_URL}/auth/logout`, {withCredentials: true})
          .then(result => {
            console.log('result', result.data.data)
            if(result.status === 200){
              console.log('result :', result.data.data.data.data)
              Cookies.set('token', result.data.data.token)

              initialState.userInfo = null
              initialState.userEmail = null

              // Cookies.set('token', result.data.data.token)
              // this.iniatialState.userInfo = {
              //   full_name: result.data.data.full_name,
              // }
              // this.initialState.orgzInfo.orgz_id= result.data.data.orgz_id
              // this.initialState.orgzInfo.orgz_name= result.data.data.orgz_id
              //   ,
              //   org_name: result.data.data.orgz_name,
              // }
              // toast('Alhamdulillah, Anda berhasil login.')
              return result.data.data
            }
          })
          .catch(error => {
            // console.log(error)
            // toast('Afwan, Error ketika login.')
            // this.state.error = true
            // this.state.errorMessage = 'Persist login error: ' + error

          })
    // const res = await fetch(`${BASE_URL}/api/auth/login`).then(
    //   (data) => data.json()
    // )
    // return res
})

// export const logout = createAsyncThunk(
//   '/auth/logout',
//   async (data) => {
//     await axios.post(`${BASE_URL}/auth/logout`, {withCredentials: true})
//           .then(result => {
//             console.log('result logout', result.data.data)
//             if(result.status === 200){

//               Cookies.remove('token')
//               // this.initialState.orgzInfo.orgz_id= result.data.data.orgz_id
//               // this.initialState.orgzInfo.orgz_name= result.data.data.orgz_id
//               //   ,
//               //   org_name: result.data.data.orgz_name,
//               // }
//               // toast('Alhamdulillah, Anda berhasil login.')
//               return result.data.data
//             }
//           })
//           .catch(error => {
//             // console.log(error)
//             // toast('Afwan, Error ketika login.')
//             // this.state.error = true
//             // this.state.errorMessage = 'Persist login error: ' + error

//           })
//     // const res = await fetch(`${BASE_URL}/api/auth/login`).then(
//     //   (data) => data.json()
//     // )
//     // return res
// })


// export const postSlice = createSlice({
//   name: 'posts',
//   initialState,
//   reducers: {},
//   extraReducers: {
//     [getPosts.pending]: (state) => {
//       state.loading = true
//     },
//     [getPosts.fulfilled]: (state, { payload }) => {
//       state.loading = false
//       state.entities = payload
//     },
//     [getPosts.rejected]: (state) => {
//       state.loading = false
//     },
//   },
// })

// export const postReducer = postSlice.reducer
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // login_: (state, action) => {
    //     axios.post(`${BASE_URL}'/api/auth/login'`, action.payload )
    //       .then(result => {
    //         if(result.status === 200){
    //           Cookies.set('token', result.data.data.token)
    //           state.userInfo = {
    //             username: result.data.data.username,
    //             full_name: result.data.data.full_name,
    //           }
    //           state.orgzInfo = {
    //             orgz_id: result.data.data.orgz_id,
    //             org_name: result.data.data.orgz_name,
    //           }
    //           // toast('Alhamdulillah, Anda berhasil login.')
    //         }
    //       })
    //       .catch(error => {
    //         // console.log(error)
    //         // toast('Afwan, Error ketika login.')
    //         state.error = true
    //         state.errorMessage = 'Persist login error: ' + error

    //       })
    // },
    register: async (state, action) => {
        await axios.post('/api/auth/register', action.payload )
          .then(result => {
            if(result.status === 200){
                // Cookies.set('token', result.data.data.token)
            //   state.userInfo = {
            //     username: result.data.data.username,
            //     full_name: result.data.data.full_name,
            //   }
            //   state.orgzInfo = {
            //     orgz_id: result.data.data.orgz_id,
            //     org_name: result.data.data.orgz_name,
            //   }

            }
          })
          .catch(error => {
            // console.log(error)
            state.error = true
            state.errorMessage = 'Persist login error: ' + error

          })
    },
    resetInfo: (state, action) => {
        state.userInfo = null
        Cookies.remove('token')
    },
    logout: (state, action) => {
      console.log(state)
        state.userInfo = null
        state.userEmail = null
        Cookies.remove('token')
    }
    // addToCart: async (state, action) => {
    //   await axios.get('/cart/add/' + action.payload._id)
    //       .then(result => {
    //         if(result.status === 200){
    //           const item = state.products.find(
    //             (item) => item._id === action.payload._id
    //           );
    //           if (item) {
    //                 item.quantity += action.payload.quantity;
    //           } else {
    //             state.products.push(action.payload);
    //           }

    //         }
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       })
    // },
    // increaseQuantity: (state, action) => {
    //   const item = state.products.find(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (item) {
    //     item.quantity++;
    //   }
    // },
    // drecreaseQuantity: (state, action) => {
    //   const item = state.products.find(
    //     (item) => item._id === action.payload._id
    //   );
    //   if (item.quantity === 1) {
    //     item.quantity = 1;
    //   } else {
    //     item.quantity--;
    //   }
    // },
    // deleteItem: (state, action) => {
    //   state.products = state.products.filter(
    //     (item) => item._id !== action.payload
    //   );
    // },
    // resetCart: (state) => {
    //   state.products = [];
    // },
  },
  // extraReducers: {
  //   [login.pending]: (state, action) => {
  //     state.loading = true
  //     state.error = true
  //     state.errorMessage = null
  //   },
  //   [login.rejected]: (state, action) => {
  //     console.log('action.error', action.error)
  //     state.error = true
  //     state.errorMessage = action.error
  //     state.loading = false
  //   },
  //   [login.fulfilled]: (state, action) => {
  //     console.log('action.payload', action.payload)
  //     console.log('state', state)
  //     Cookies.set('token', action.payload.data.token)
  //     state.userInfo = {
  //       full_name: action.payload.full_name,
  //       email: action.payload.email,
  //       uni: action.payload.uni,
  //       is_admin: action.payload.is_admin
  //     }
  //     state.loading = false
  //   }
  // }
  extraReducers: (builder) => {
    builder.addCase(
      login.pending, (state, action) => {
        console.log('on pending')
        state.loading = true
        state.error = true
        state.errorMessage = null
      }
    )
    .addCase(
      login.fulfilled, (state, action) => {
        console.log('on fullfilled')
        console.log('action.payload', action, action.meta)
        console.log('state', state)
        // Cookies.set('token', action.payload.token)

        const token = Cookies.get('token')

        if(token){
          state.userInfo = {
            email: action.meta.arg.username
            // full_name: action.meta.arg.email,
            // uni: action.payload.uni,
            // is_admin: action.payload.is_admin
          }
          state.userEmail = action.meta.arg.username
        }
        state.loading = false
      }
    )
    .addCase(
      login.rejected, (state, action) => {
        console.log('on rejected')
        console.log('action.error', action.error)
        state.error = true
        state.errorMessage = action.error
        state.loading = false
      }
    )
    // builder.addCase(
    //   logout.pending, (state, action) => {
    //     state.loading = true
    //     state.error = true
    //     state.errorMessage = null
    //   },
    //   logout.fulfilled, (state, action) => {
    //     console.log('action.payload', action.payload)
    //     console.log('state', state)
    //     Cookies.set('token', action.payload.token)
    //     state.userInfo = null
    //     state.loading = false
    //   },
    //   logout.rejected, (state, action) => {
    //     console.log('action.error', action.error)
    //     state.error = true
    //     state.errorMessage = action.error
    //     state.loading = false
    //   }
    // )

  }
});

export const {
  resetInfo,
  logout,
  loading,
  userInfo,
  extraReducers
} = authSlice.actions;
export default authSlice.reducer;