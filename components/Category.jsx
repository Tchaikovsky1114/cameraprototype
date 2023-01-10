import { Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const Category = ({category}) => {

  const navigation = useNavigation();
  const pressCategoryButtonHandler = () => {
    navigation.navigate('CategoryDetail',{
      title: category.category
    })
  }
  
  return (
    <Pressable
    onPress={pressCategoryButtonHandler}
      style={({pressed}) => [{backgroundColor:category.code},styles.container,(category.category === '버튼'|| category.category === '키링') ? styles.button : null,{ opacity: pressed ? 0.78 : 1}]}
      disabled={!(category.category === '버튼'|| category.category === '키링')}
    >
      <Text style={[{color:'#fff',fontWeight:'bold',fontSize:16,width:'100%'},(category.category === '버튼' || category.category === '키링') ? styles.buttonText : null]}>{category.category}</Text>
    </Pressable>
  )
}

export default Category

const styles = StyleSheet.create({
  container:{
    width:130,
    overflow: 'hidden',
    paddingHorizontal:8,
    height:100,
    paddingVertical:8,
    flex:1,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    borderRadius:8,
    elevation:3,
    shadowColor:'#fff',
    shadowOpacity:1,
    shadowRadius:8,
    shadowOffset:{
      width:0,
      height:2
    },
  },
  button: {
    backgroundColor:'#f75c31'
  },
  buttonText:{
    color:'#fff',
  }
})