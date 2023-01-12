import { useWindowDimensions } from 'react-native'
import { useEffect, useState } from 'react'


const useCalculateDimensions = ({minWidth,fixedWidth,fixedHeight,calculateWidth}) => {
  
  const { width, height } = useWindowDimensions();
  
  const [deviceWidth,setDeviceWidth] = useState(0)
  const [deviceHeight,setDeviceHeight] = useState(0);
  useEffect(() => {
    if(!calculateWidth){
      setDeviceWidth(width < minWidth ? width : fixedWidth);
      setDeviceHeight(width < minWidth ? (width / 3) * 4 : fixedHeight);  
    }else{
      setDeviceWidth(width < minWidth ? calculateWidth : fixedWidth);
      setDeviceHeight(width < minWidth ? (width / 3) * 4 : fixedHeight);
    }
    
  }, [width,height])
  
  return { deviceHeight, deviceWidth }
}

export default useCalculateDimensions

