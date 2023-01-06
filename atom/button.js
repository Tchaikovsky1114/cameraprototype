import { atom } from 'recoil';




export const buttonState = atom({
  key: 'buttonState',
  default: {
    buttonImage: [],
    rmat: [],
    paperSize: [],
    processingSize: {},
    optionQuantity: {},
    orderCount: [],
    shrinkSize: [],
    ink : [],
    packaging: [],
    coating: [],
  },
})