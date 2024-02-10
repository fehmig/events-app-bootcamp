import React from 'react';
import { StyleSheet, Text, View, FlatList, StatusBar, ScrollView, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import { useStore } from '../store/store';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import EventCard from '../components/EventCard';
import GradientBGIcon from '../components/GradientBGIcon';


const PlaceScreen = ({ route, navigation }: any) => {
    const { place } = route.params;
    const EventList = useStore((state: any) => state.EventList);
    const addToCart = useStore((state: any) => state.addToCart);
    const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
    const filteredEvents = EventList.filter((event: any) => {
      return event.place === place
    });
  
    const EventCardAddToCart = ({
      id,
      index,
      name,
      place,
      imagelink_square,
      special_ingredient,
      type,
      prices,
    }: any) => {
      addToCart({
        id,
        index,
        name,
        place,
        imagelink_square,
        special_ingredient,
        type,
        prices,
      });
      calculateCartPrice();
      ToastAndroid.showWithGravity(
        `${name} sepete eklendi!`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      navigation.navigate('Cart');
    };
    
    const goBack = () => {
        navigation.goBack()
    }
 
    return (
      <View style={styles.ScreenContainer}>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollViewFlex}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={goBack}>
              <GradientBGIcon
                name="left"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_16}
              />
            </TouchableOpacity>
            <Text style={styles.ScreenTitle}><Text style={{color:COLORS.primaryOrangeHex}}>{place}{'\n'}</Text>isimli mekanda yer alan mevcut etkinlikler</Text>
          </View>
          <FlatList
            ListEmptyComponent={
              <View style={styles.EmptyListContainer}>
                <Text style={styles.CategoryText}>Etkinlik Bulunamadı</Text>
              </View>
            }
            contentContainerStyle={styles.FlatListContainer}
            keyExtractor={(item) => item.id}
            numColumns={2}
            horizontal={false}
            scrollEnabled={false}
            data={filteredEvents}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Details', {
                      index: item.index,
                      id: item.id,
                      type: item.type,
                    });
                  }}>
                  <EventCard
                    id={item.id}
                    index={item.index}
                    type={item.type}
                    place={item.place}
                    imagelink_square={item.imagelink_square}
                    name={item.name}
                    special_ingredient={item.special_ingredient}
                    average_rating={item.average_rating}
                    price={item.prices[2]}
                    buttonPressHandler={EventCardAddToCart}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    ScreenContainer: {
      flex: 1,
      backgroundColor: COLORS.primaryBlackHex,
    },
    ScrollViewFlex: {
      flexGrow: 1,
    },
    FlatListContainer: {
      gap: SPACING.space_20,
      paddingVertical: SPACING.space_20,
      paddingHorizontal: SPACING.space_30,
      marginBottom: SPACING.space_36
    },
    EmptyListContainer: {
      width: Dimensions.get('window').width - SPACING.space_30 * 2,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.space_36 * 3.6,
    },
    CategoryText: {
      fontFamily: FONTFAMILY.poppins_semibold,
      fontSize: FONTSIZE.size_16,
      color: COLORS.primaryLightGreyHex,
      marginBottom: SPACING.space_4,
    },
    ScreenTitle: {
      fontSize: FONTSIZE.size_20,
      fontFamily: FONTFAMILY.poppins_semibold,
      color: COLORS.primaryWhiteHex,
      paddingLeft: SPACING.space_30,
      paddingRight: SPACING.space_20,
      marginBottom: SPACING.space_15,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding:SPACING.space_16,
      marginTop:SPACING.space_10
    },
  });
  
  export default PlaceScreen;
  


