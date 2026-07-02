import axios from 'axios'
import {v2 as cloudinary} from 'cloudinary'

export const uploadImage = async (image) => {

  try {

    console.log('image', image)


    const CLOUD_NAME = 'dodrj3l9p'

    const URL = import.meta.env.VITE_CLOUDINARY_API_URL
    const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY
    const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET

    var timestamp = Math.round((new Date()).getTime()/1000)

    console.log('timestamp', timestamp)

    const eager = 'w_400,h_300,c_pad|w_260,h_200,c_crop'

    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      eager: eager,
      public_id: image.name + new Date().getTime()
    }, API_SECRET)

    const AUTH_STRING = 'Basic ' + btoa(API_KEY + ":" + API_SECRET)
    console.log('AUTH_STRING', AUTH_STRING)

    const BASE_URL = `${URL}/${CLOUD_NAME}/image/upload`
    // const BASE_URL = `https://${API_KEY}:${API_SECRET}@api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    // 'Authorization': AUTH_STRING

    await axios.post(`${BASE_URL}`, {
                  file: image,
                  // public_id: `${image.name}-${new Date().getTime()}`,
                  api_key: API_KEY,
                  // eager: eager,
                  timestamp: timestamp,
                  signature: signature
                },
                // {
                //   headers: {'Content-Type': 'multipart/form-data'}
                // }
                )
                .then(result => {
                  if(result.status === 200){
                    console.log('result', result)
                    return result.url
                  }
                }).catch(error => {

                  console.log(error)
                  return 0
                })

  } catch (error) {

    console.log('error', error)
    return 0
  }

  // https://516923385564595:J_oPWfUdrZCI4K9ZH1dSOJQF6-0@api.cloudinary.com/v1_1/dodrj3l9p/image/upload

}