import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from './store'

export interface ImageState {
  imageSrc?: string
  scale: number
}

export const initialImageState: ImageState = {
  imageSrc: undefined,
  scale: 1,
}

export const imageScaleRange = {
  min: 0.1,
  max: 10,
}

export const imageSlice = createSlice({
  name: 'image',
  initialState: initialImageState,
  reducers: {
    imageSelected(state, action: PayloadAction<{imageSrc: string; scale: number}>) {
      state.imageSrc = action.payload.imageSrc
      state.scale = action.payload.scale
    },
    imageScaleChanged(state, action: PayloadAction<{scale: number}>) {
      let scale = action.payload.scale
      if (scale < imageScaleRange.min) {
        scale = imageScaleRange.min
      } else if (scale > imageScaleRange.max) {
        scale = imageScaleRange.max
      }
      state.scale = scale
    },
  },
})

export const {imageSelected, imageScaleChanged} = imageSlice.actions

export const selectHasImage = (state: RootState) => !!state.image.imageSrc
export const selectImageSrc = (state: RootState) => state.image.imageSrc
export const selectImageScale = (state: RootState) => state.image.scale

export default imageSlice.reducer
