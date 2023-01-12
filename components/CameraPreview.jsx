import { Button, ImageBackground, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import useCalculateDimensions from '../hooks/useCalculateDimensions';

const CameraPreview = ({photo,retakePictureHandler,savePictureHandler,editPictureHandler}) => {
  const {width} = useWindowDimensions();
  const { deviceHeight,deviceWidth } = useCalculateDimensions({
    fixedHeight:520,
    fixedWidth:390,
    minHeight: 330,
    minWidth: 330
  })
  console.log(deviceHeight,deviceWidth);

  return (
    <View style={{backgroundColor:'#fff',flex:1,alignItems:'center',position:'relative'}}>
      
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{width:deviceWidth,height:deviceHeight}}
      />
      <View style={{position:'absolute',width,bottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:8}}>
          <Pressable
            onPress={retakePictureHandler}
            style={{height:48,justifyContent:'center',alignItems:'center',width:88,backgroundColor:'red',borderRadius:8}}
          >
            <Text style={{color:'#fff'}}>다시찍기</Text>
          </Pressable>
          <Pressable
            onPress={savePictureHandler}
            style={{height:48,justifyContent:'center',alignItems:'center',width:88,backgroundColor:'blue',borderRadius:8}}
          >
            <Text style={{color:'#fff'}}>저장하기</Text>
          </Pressable>
          <Pressable
            onPress={editPictureHandler}
            style={{height:48,justifyContent:'center',alignItems:'center',width:88,backgroundColor:'green',borderRadius:8}}
          >
            <Text style={{color:'#fff'}}>편집하기</Text>
          </Pressable>
        </View>
    </View>
  )
}

export default CameraPreview

const styles = StyleSheet.create({})