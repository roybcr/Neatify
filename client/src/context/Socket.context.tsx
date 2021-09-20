/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../../config/default";
import { INotification } from "../types";

export interface IContext {
  socket: Socket;
  notification?: INotification;
  setNotification: (notification?: INotification) => void;
}

const socket = io(SOCKET_URL);
const SocketContext = React.createContext<IContext>({
  socket,
  notification: undefined,
  setNotification: () => {},
});
function SocketProvider(props: any) {
  const [notification, setNotification] = React.useState<INotification>();
  socket.on("notification", (data?: INotification) => {
    setNotification(data || undefined);
  });

  return <SocketContext.Provider value={{ socket, notification, setNotification }} {...props} />;
}

export const useSocket = () => React.useContext(SocketContext);

export default React.memo(SocketProvider);
