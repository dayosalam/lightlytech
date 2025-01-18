import React from "react";
import { Stack } from "expo-router";
import { Button } from "react-native";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
