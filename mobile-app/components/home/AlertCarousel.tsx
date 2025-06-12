import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Text,
} from "react-native";
import AlertCard from "./AlertCard";
import { useAlerts } from "@/hooks/useAlerts";
import { IEnergyAlert } from "@/interfaces";

const { width } = Dimensions.get("window");


const AlertCarousel = () => {
  const { data: alerts } = useAlerts();

  
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);

    if (currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {alerts?.map((alert: IEnergyAlert) => (
          <View key={alert.id} style={styles.slide}>
            <AlertCard message={alert.message} emoji={alert.emoji} />
          </View>
        ))}
      </ScrollView>

      {/* Paginator */}
      <View style={styles.paginatorContainer}>
        {alerts?.map((_: IEnergyAlert, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginatorDot,
              index === activeIndex && styles.paginatorDotActive,
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollView: {
    width: width,
  },
  slide: {
    width: width,
    paddingHorizontal: 20,
  },
  paginatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginatorDot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#d9d9d9",
    marginHorizontal: 4,
  },
  paginatorDotActive: {
    backgroundColor: "#ff671f", // Orange color for active dot
    width: 16, // Make active dot wider
  },
});

export default AlertCarousel;
