import { FlatList, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Category from './Category'
import { useRecoilState } from 'recoil'
import { buttonState } from '../atom/button'
import axios from 'axios'
import { keyringState } from '../atom/keyring'
import { FlatGrid } from 'react-native-super-grid'




const DUMMY_CATEGORIES_DATA = {
  categories: [
    {
      id:10011,
      category:"무드등",
      product: ["Neon Heart", "Cherry Cherry", "망고튤립", "행운의 고래"],
      code: '#1abc9c'
    },
    {
      id:10012,
      category:"액자",
      product: ["원목액자", "초슬릭알루미늄액자","캔버스액자","프리미엄아크릴디아섹액자"],
      code: '#2ecc71'
    },
  {
    id:20014,
    category:"버튼",
    code: '#3498db',
  },
  {
    id:20015,
    category:"마스킹테이프",
    code: '#9b59b6'
  },
  {
    id:20016,
    category:"하드폰케이스",
    code: '#34495e'
  },
  {
    id:20017,
    category:"투명폰케이스",
    code: '#16a085'
  },
  {
    id:20018,
    category:"에어팟케이스",
    code: '#27ae60'
  },
  {
    id:20019,
    category:"부채",
    code: '#2980b9'
  },
  {
    id:200110,
    category:"아크릴판",
    code: '#8e44ad',

  },
  {
    id:200111,
    category:"무드등",
    code: '#2c3e50'
  },
  {
    id:200112,
    category:"가림막",
    code: '#f1c40f'
  },
  {
    id:200113,
    category:"톡",
    code: '#e67e22'
  },
  {
    id:200114,
    category:"키링",
    code: '#e74c3c'
  },
  {
    id:200115,
    category:"명찰",
    code: '#2d63e2'
  },
  {
    id:200116,
    category:"비츠",
    code: '#2ae4f1'
  },
  {
    id:200117,
    category:"꽃병",
    code: '#f39c12'
  },
  {
    id:200118,
    category:"트레이",
    code: '#d4d2a2'
  },
  {
    id:200119,
    category:"절곡",
    code: '#c0392b'
  },
  {
    id:200120,
    category:"다보액자",
    code: '#7f8c8d'
  }
]
}

const Categories = () => {
  const [button,setButton] = useRecoilState(buttonState);
  const [keyring,setKeyring] = useRecoilState(keyringState);
  const getAllProduct = async () => {
    try {
      const { data } = await axios.get('http://www.adpiamall.com/modules/api/estimate/print/init/options.php?category=RP3300&product=PRP033&goods_no=30');

      console.log(data);
      return data;
    } catch (error) {
      console.log(error.response.data); 
    }
  }

  useEffect(() => {
    getAllProduct().then((response) => {
      const paperSize = response.PAPERSIZE.slice(72,76);
      const processingSize = response.size.find((sz) => sz.id === "91")
      const optionQuantity = response.optionqty.filter((item) => item.cat_code === "RP3300");
      const shrinkSize = response.PRINTING.filter((item) => item.common_code.includes("SST"));
      const packaging = response.PRINTING.filter((item) => item.common_code.includes("OPP10") || item.common_code.includes("OPS10"))
      const coating = response.coating.filter((item) => item.type_code.includes("COT11") || item.type_code.includes("COT21"))
      const gettingData = {
        shrinkSize,
        paperSize,
        processingSize,
        optionQuantity,
        packaging,
        coating,
        buttonImage : response.buttonimage,
        rmat: response.rmatcode[0],
        orderCount: response.ordercount,  
        ink: response.ink[0],
      }
      
      const keyringMaterial = response.rmat.filter((item) =>
      item.rmat_code.includes('ACLP03RG0')
      || item.rmat_code.includes('ACLP03HG0')
      || item.rmat_code.includes('ACLP03GL0')
      || item.rmat_code.includes('ACL003TP0')
      )
      const keyringSize = response.PAPERSIZE.filter((item) =>
      item.size_type_code === 'CRP53'
      || item.size_type_code === 'CRP54'
      )
      const keyringType = response.krt_imgs
      const keyringQuantity = response.optionqty.filter((item) => item.cat_code ==='RP3300')
      const keyringBackface = ["반전","동일"]
      const keyringAccessories = response.PRINTING.filter((item) => item.h_code === "RNG");
      
      const keyringData = {
        keyringAccessories,
        keyringBackface,
        keyringMaterial,
        keyringQuantity,
        keyringType,
        keyringSize,
        keyringOrderCount: response.ordercount
      }
      setButton(gettingData)
      setKeyring(keyringData)
    });
  } ,[])
  // console.log(keyring)
  
  return (
    <FlatGrid 
    itemDimension={100}
    data={DUMMY_CATEGORIES_DATA.categories}
    style={styles.container}
    renderItem={({item}) => (<Category key={item.id} category={{...item}} />)}
    spacing={10}
    
    />
    // <FlatList
    // contentContainerStyle={[styles.container]}
    // data={DUMMY_CATEGORIES_DATA.categories}
    // renderItem={({item}) => (<Category key={item.id} category={{...item}} />)}
    // numColumns={2}
    // showsVerticalScrollIndicator={false}
    // />
  )
}

export default Categories

const styles = StyleSheet.create({
  container:{
    paddingTop:10,
    backgroundColor:'#fff',
    flex:1
  }
  
})