import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import {Camera,CameraType} from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react'
import CameraPreview from './CameraPreview';
import { useRecoilState, useRecoilValue } from 'recoil';
import { pictureState } from '../atom/picture';
import { Asset } from 'expo-asset'
import * as MediaLibrary from 'expo-media-library';
import { removebgPictureState } from '../atom/removebgPicture';

const CameraScreen = ({navigation}) => {
  const cameraRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const {width,height} = useWindowDimensions();
  const [picture,setPicture] = useRecoilState(pictureState);
  const [removebgPicture,setRemovebgPicture] = useRecoilState(removebgPictureState);

  const takePictureHandler = async() => {
    if(!cameraRef.current) return;
    
    await cameraRef.current.takePictureAsync({
      base64:true,
    })
    .then((data) => {
      setPreviewVisible(true);
      setCapturedImage(data)
      
    })
  }
  
  
  const retakePictureHandler = () => {
    setPreviewVisible(false);
    setCapturedImage(null);
    // navigation.navigate('CameraScreen')
  }

  const savePictureHandler = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if(status === 'granted'){
        await MediaLibrary.saveToLibraryAsync(capturedImage.uri).then(() => {
          setRemovebgPicture(null);
          setPicture(capturedImage);
        });
        // const image = Asset.fromURI(capturedImage.uri);
        // await image.downloadAsync()
        // setTest(image);
      }
      navigation.navigate('CategoryDetail',{
        title:'버튼'
      })  
    } catch (error) {
      console.error(error);
    }
    
  }
  
  useEffect(() => {
    navigation.setOptions({
      title:'상품 사진 등록',
    })
  },[])

  return (
    previewVisible && capturedImage ?
    <CameraPreview photo={capturedImage} retakePictureHandler={retakePictureHandler} savePictureHandler={savePictureHandler} />
    : 
    <View style={{flex:1}}>
      <Camera 
        style={{flex:1,position:'relative'}}
        ref={cameraRef}
      />
      <View style={{justifyContent:'center',alignItems:'center',width,position:'absolute',bottom:0}}>
        <TouchableOpacity
          onPress={takePictureHandler}
          style={styles.touchButton}
          >
          <Text style={{color:'#fff'}}>Click Me!</Text>
        </TouchableOpacity>
      </View>
    </View>)
  
}

export default CameraScreen

const styles = StyleSheet.create({
  touchButton:{borderRadius:200,width:70,height:70,backgroundColor:'#2d63e2',bottom:20,justifyContent:'center',alignItems:'center'}
})