// components/PushTokenManager.tsx
import { useSyncPushToken } from "@/hooks/useSyncPushToken";

export default function PushTokenManager() {
  useSyncPushToken();
  return null; // renders nothing
}
