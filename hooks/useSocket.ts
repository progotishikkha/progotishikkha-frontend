import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/tokenStore";

/**
 * Opens a live Socket.io connection once `enabled` is true.
 *
 * Previously this read the access token exactly once, on the very first
 * mount, with an empty dependency array — but on a hard page reload the
 * token isn't set yet at that instant (AuthContext restores it a moment
 * later via a silent refresh), so the socket never connected and nothing
 * in the app ever actually used this hook. Passing `enabled` (true once
 * AuthContext has a logged-in user) lets the effect re-run right when a
 * token becomes available, and again after login/logout.
 */
export function useSocket(onNotification: (payload: unknown) => void, enabled: boolean) {
  const socketRef = useRef<Socket | null>(null);
  const handlerRef = useRef(onNotification);
  handlerRef.current = onNotification;

  useEffect(() => {
    if (!enabled) return;
    const token = getAccessToken();
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5000", {
      auth: { token },
      withCredentials: true,
    });

    const listener = (payload: unknown) => handlerRef.current(payload);
    socket.on("notification", listener);
    socketRef.current = socket;

    return () => {
      socket.off("notification", listener);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled]);

  return socketRef;
}
