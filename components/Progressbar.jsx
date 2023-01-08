import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import * as Progress from 'react-native-progress';
const Progressbar = ({nowStep = 0,totalStep = 100,removebgStatus}) => {
  
  const progressValue = useRef(new Animated.Value(0)).current;

  const load = (count) => {
    Animated.timing(progressValue, {
      toValue: count,
      duration: 500,
      useNativeDriver: false
    }).start()
  }

  const statusbarWidth = progressValue.interpolate({
    inputRange: [0,100],
    outputRange:["0%","100%"],
    extrapolate: "clamp"
  })

  useEffect(() => {
    load(nowStep)
  }, [nowStep])
  return (
    <View style={{width:'100%',justifyContent:'center',alignItems:'center',marginTop:24}}>
      {removebgStatus === 'pending' ? <Text>배경 제거를 원하시면 아래 버튼을 클릭해주세요</Text> : null}
      {removebgStatus === 'loading' ? <Text>사진을 업로드 하고있어요.</Text> : null}
      {removebgStatus === 'fulfilled' ? <Text>배경이 제거되었어요! 확인하러 가볼까요?</Text> : null}
      <View style={styles.bar}>
        {nowStep ? <Progress.Bar progress={!totalStep ? 0 : nowStep / totalStep } width={200} /> : null}
        {nowStep ? <Text style={styles.step}>({(nowStep / 1e+6).toFixed(2)}MB / {(totalStep / 1e+6).toFixed(2)}MB)</Text> : null}
      </View>
    </View>
  )
}

export default Progressbar

const styles = StyleSheet.create({
  bar: {
    width: 200,
    height: 30,
    marginVertical:8,
  },
  step: {
    color: '#2d63e2',
    fontSize: 22,
    textAlign: 'center',
    
  }
})