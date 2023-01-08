import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import * as Progress from 'react-native-progress';
const Progressbar = ({nowStep = 0,totalStep = 100}) => {
  
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
    <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
      {(nowStep && nowStep !== totalStep) ? <Text>사진을 업로드 하고있어요.</Text> : null}
      {(nowStep && nowStep === totalStep) ? <Text>배경을 제거하고 있어요. 잠시만 기다려주세요.</Text> : null}
      <View style={styles.bar}>
        <Progress.Bar progress={!totalStep ? 0 : nowStep / totalStep } width={200} />
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
    
  },
  step: {
    color: '#2d63e2',
    fontSize: 22,
    textAlign: 'center'
  }
})