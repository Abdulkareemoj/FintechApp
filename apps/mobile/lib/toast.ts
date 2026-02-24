import { Alert, Platform, ToastAndroid } from "react-native";

export function showToast(params: {
  title?: string;
  message: string;
  type?: "success" | "error" | "info";
}) {
  if (Platform.OS === "android") {
    ToastAndroid.show(params.message, ToastAndroid.SHORT);
    return;
  }

  Alert.alert(params.title ?? "", params.message);
}
