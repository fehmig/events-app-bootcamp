
import React from 'react';
import { Modal, Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import  CustomIcon  from './CustomIcon'; // CustomIcon'ın uygun olduğu dosyaya göre import edin
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';

interface ModalProps {
  visible: boolean;
  filterType: 'dates' | 'location' | 'place';
  options: string[];
  onRequestClose: () => void;
  onSelectOption: (option: string) => void;
}

const FilterModal: React.FC<ModalProps> = ({ visible, filterType, options, onRequestClose, onSelectOption }) => {
  const getTitleText = () => {
    switch (filterType) {
      case 'dates':
        return 'Mevcut Etkinlik Tarihleri';
      case 'location':
        return 'Mevcut Etkinlik Şehirleri';
      case 'place':
        return 'Mevcut Etkinlik Mekanları';
      default:
        return '';
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={onRequestClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>
            <CustomIcon name='close' color={COLORS.primaryDarkGreyHex} />
          </Text>
        </TouchableOpacity>

        <ScrollView style={styles.menu}>
          <Text style={styles.TitleText}>{getTitleText()}</Text>
          {options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => onSelectOption(option)}>
              <Text style={styles.OptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({

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
      OptionText:{
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.secondaryLightGreyHex,
        marginBottom: SPACING.space_4,
      },
      TitleText:{
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryWhiteHex,
        marginBottom: SPACING.space_4,
      }
})