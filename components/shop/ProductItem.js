import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform
} from 'react-native';

import Cart from '../UI/Cart';

const ProductItem = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }
  return (
    <Cart style={styles.productItem}>
      <View style={styles.touchable}>
        <TouchableComp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            </View>
            <View style={styles.actionBtns}>{props.children}</View>
          </View>
        </TouchableComp>
      </View>
    </Cart>
  );
};

const styles = StyleSheet.create({
  productItem: {
    height: 300,
    margin: 20
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  details: {
    alignItems: 'center',
    height: '17%',
    padding: 10
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    marginVertical: 2
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 12,
    color: '#888'
  },
  actionBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '23%',
    paddingHorizontal: 15
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  }
});

export default ProductItem;
