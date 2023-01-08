import { ImageBackground, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'

const CameraPreview = ({photo,retakePictureHandler,savePictureHandler}) => {
  const {width,height} = useWindowDimensions();

  
  return (
    <View style={{backgroundColor:'transparent',flex:1}}>
      <ImageBackground
      source={{uri: photo && photo.uri}}
      style={{flex:1,position:'relative'}}
      >
        <View style={{position:'absolute',width,bottom:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:24}}>
          <Pressable
            onPress={retakePictureHandler}
            style={{height:50,justifyContent:'center',alignItems:'center',width:100,backgroundColor:'red',paddingHorizontal:24}}
          >
            <Text style={{color:'#fff'}}>다시찍기</Text>
          </Pressable>
          <Pressable
            onPress={savePictureHandler}
            style={{height:50,justifyContent:'center',alignItems:'center',width:100,backgroundColor:'blue',paddingHorizontal:24}}
          >
            <Text style={{color:'#fff'}}>저장하기</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  )
}

export default CameraPreview

const styles = StyleSheet.create({})