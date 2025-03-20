import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface SecurityOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  route: string;
}

const Security = () => {
  const router = useRouter();

  const securityOptions: SecurityOption[] = [
    {
      id: "change_password",
      title: "Change password",
      icon: "key-outline",
      route: "change-password",
    },
    {
      id: "change_email",
      title: "Change email",
      icon: "mail-outline",
      route: "change-email",
    },
    {
      id: "support",
      title: "Support",
      subtitle: "Reach out to us",
      icon: "help-circle-outline",
      route: "support",
    },
  ];

  const handleOptionPress = (route: string) => {
    // Using the route as-is since we're already in the (profile) group
    // TypeScript will accept this because we're explicitly casting to any
    router.push(route as any);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Security</Text>

          <View style={styles.optionsList}>
            {securityOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={() => handleOptionPress(option.route)}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color="#022322"
                  />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8b9a99" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Security;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "90%",
    maxWidth: 500,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#022322",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "left",
  },
  optionsList: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  optionIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: "InterSemiBold",
    color: "#022322",
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#8b9a99",
    marginTop: 2,
  },
});
