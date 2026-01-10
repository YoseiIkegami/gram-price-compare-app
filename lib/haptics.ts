import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const IS_DEV = __DEV__;

/**
 * 軽いハプティクスフィードバック（ボタンタップ用）
 */
export async function triggerLightHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    if (IS_DEV) {
      console.warn("Haptic feedback not available:", error);
    }
  }
}

/**
 * 中程度のハプティクスフィードバック（トグル用）
 */
export async function triggerMediumHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    if (IS_DEV) {
      console.warn("Haptic feedback not available:", error);
    }
  }
}

/**
 * 成功フィードバック
 */
export async function triggerSuccessHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  } catch (error) {
    if (IS_DEV) {
      console.warn("Haptic feedback not available:", error);
    }
  }
}

/**
 * エラーフィードバック
 */
export async function triggerErrorHaptic() {
  if (Platform.OS === "web") return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    if (IS_DEV) {
      console.warn("Haptic feedback not available:", error);
    }
  }
}
