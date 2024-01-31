import React, { useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  Modal,
} from 'react-native';
import { useStore } from '../store/store';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import { FlatList } from 'react-native';
import CoffeeCard from '../components/CoffeeCard';
import { Dimensions } from 'react-native';
import SwiperFlatListComponent from '../components/SliderComponent';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].category] == undefined) {
      temp[data[i].category] = 1;
    } else {
      temp[data[i].category]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('Tümü');
  return categories;
};

const getEventList = (category: string, data: any) => {
  if (category == 'Tümü') {
    return data;
  } else {
    let eventlist = data.filter((item: any) => item.category == category);
    return eventlist;
  }
};

const HomeScreen = ({ navigation }: any) => {
  const EventList = useStore((state: any) => state.EventList);
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  const getDatesFromData = (data: any) => {
    let temp: any = {};
    for (let i = 0; i < data.length; i++) {
      if (temp[data[i].date] == undefined) {
        temp[data[i].date] = 1;
      } else {
        temp[data[i].date]++;
      }
    }
    let dates= Object.keys(temp);
    return dates;
  }; 

  const [dates, setDates] = useState(getDatesFromData(EventList));
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const [categories, setCategories] = useState(
    getCategoriesFromData(EventList),
  );
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  
  const [sortedEvent, setSortedEvent] = useState(
    getEventList(categoryIndex.category, EventList),
  );

  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  const handleDatePress = (selectedDate: string) => {
    // Seçilen tarihe göre etkinlikleri güncelle
    const eventsForSelectedDate = EventList.filter((item: { date: string; }) => item.date === selectedDate);
    setSortedEvent(eventsForSelectedDate);
  
    // Menüyü kapat
    toggleMenu();
  };

  const handleCategoryChange = (selectedCategory: string) => {
    // Kategori değiştiğinde tarihleri güncelle
    const filteredEventList = getEventList(selectedCategory, EventList);
    setSortedEvent(filteredEventList);
    const filteredDates = getDatesFromData(filteredEventList);
    setDates(filteredDates);
    setCategoryIndex({ index: categories.indexOf(selectedCategory), category: selectedCategory });
  };

  const searchCoffee = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({ index: 0, category: categories[0] });
      setSortedEvent([
        ...EventList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };

  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({ index: 0, category: categories[0] });
    setSortedEvent([...EventList]);
    setSearchText('');
  };

  const CoffeCardAddToCart = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
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
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* App Header */}
        <HeaderBar />

        <Text style={styles.ScreenTitle}>
          Hayatınızı Renklendirin,{'\n'}Etkinliklerle Dolu Bir Dünya!
        </Text>

        <SwiperFlatListComponent />

        {/* Search Input */}

        <View style={styles.InputContainerComponent}>
          <TouchableOpacity
            onPress={() => {
              searchCoffee(searchText);
            }}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Etkinlik ara..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              searchCoffee(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                resetSearchCoffee();
              }}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>

        {/* Category Scroller */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}>
           <TouchableOpacity onPress={toggleMenu}>
        <CustomIcon
          name="add"
          size={FONTSIZE.size_18}
          color={COLORS.primaryOrangeHex}
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMenu}
        onRequestClose={() => {
          setShowMenu(!showMenu);
        }}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Text style={styles.closeButtonText}><CustomIcon name='close' color={COLORS.primaryDarkGreyHex}/></Text>
          </TouchableOpacity>
          <ScrollView style={styles.menu}>
            {dates.map((date, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}  onPress={() => handleDatePress(date)}>
                <Text style={styles.DateText}>{date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

          {categories.map((data, index) => (
            <View
              key={index.toString()}
              style={styles.CategoryScrollViewContainer}>
              <TouchableOpacity
                style={styles.CategoryScrollViewItem}
                onPress={() => handleCategoryChange(data)}>
                <Text
                  style={[
                    styles.CategoryText,
                    categoryIndex.index == index
                      ? { color: COLORS.primaryOrangeHex }
                      : {},
                  ]}>
                  {data}
                </Text>
                {categoryIndex.index == index ? (
                  <View style={styles.ActiveCategory} />
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Coffee Flatlist */}

        <FlatList
          ref={ListRef}
          horizontal
          ListEmptyComponent={
            <View style={styles.EmptyListContainer}>
              <Text style={styles.CategoryText}>Etkinlik Bulunamadı</Text>
            </View>
          }
          showsHorizontalScrollIndicator={false}
          data={sortedEvent}
          contentContainerStyle={styles.FlatListContainer}
          keyExtractor={(item) => item.id}
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
                <CoffeeCard
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  name={item.name}
                  special_ingredient={item.special_ingredient}
                  average_rating={item.average_rating}
                  price={item.prices[2]}
                  buttonPressHandler={CoffeCardAddToCart}
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
  ScreenTitle: {
    fontSize: FONTSIZE.size_24,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
    marginBottom: SPACING.space_15,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menu: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLORS.primaryDarkGreyHex,
    height:300,
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: 20,
    backgroundColor: COLORS.primaryOrangeHex,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_16,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryGreyHex,
  },
  DateText:{
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.secondaryLightGreyHex,
    marginBottom: SPACING.space_4,
  }
});

export default HomeScreen;
