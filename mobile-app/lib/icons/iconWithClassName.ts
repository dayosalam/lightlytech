import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from 'nativewind';

export function iconWithClassName(icon: typeof Ionicons) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
      },
    },
  });
}
