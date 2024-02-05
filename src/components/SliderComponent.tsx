import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { SwiperFlatListWithGestureHandler } from 'react-native-swiper-flatlist/WithGestureHandler';

const eventData = [
  { key: '3', image: require('../assets/banners/banner3.jpg') },
  { key: '1', image: require('../assets/banners/banner1.png') },
  { key: '2', image: require('../assets/banners/banner2.jpg') },
  { key: '4', image: require('../assets/banners/banner4.jpg') },
];

const SwiperFlatListComponent = () => {
  return (
    <View style={styles.container}>
      <SwiperFlatListWithGestureHandler
        autoplay
        autoplayDelay={3}
        autoplayLoop
        showPagination
        paginationDefaultColor="#333"
        paginationActiveColor="#D17842"
        paginationStyleItem={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 3,
          marginTop:8
        }}
        paginationStyle={{ position: 'absolute', bottom: 0}}
        data={eventData}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={item.image} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flex:1
  },
  item: {
    justifyContent:'center',
    alignItems:'center',
    height: 200, 
  },
  image: {
    flex:1,
    resizeMode: 'contain',
    width:Dimensions.get('window').width,
  },
});

export default SwiperFlatListComponent;
