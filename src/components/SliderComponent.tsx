import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const eventData = [
  { key: '1', image: require('../assets/event_assets/concerts/square/canozan_square.jpg') },
  { key: '2', image: require('../assets/event_assets/theatres/square/vedaoyunu_square.jpeg') },
  { key: '3', image: require('../assets/event_assets/fests/square/izmirfest_square.jpg') },
  { key: '4', image: require('../assets/event_assets/fests/square/kocaelifest_square.png') },
];

const SwiperFlatListComponent = () => {
  return (
    <View style={styles.container}>
      <SwiperFlatList
        autoplay
        autoplayDelay={2}
        autoplayLoop
        index={0}
        showPagination
        paginationDefaultColor="#333"
        paginationActiveColor="#FFF"
        paginationStyleItem={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 3,
        }}
        paginationStyle={{ position: 'absolute', bottom: 10, left: 10 }}
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
    flex: 1,
  },
  item: {
    width: '100%',
    height: 200,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default SwiperFlatListComponent;
