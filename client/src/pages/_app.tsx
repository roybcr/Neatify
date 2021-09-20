import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { AppProps } from "next/app";
import SocketProvider from "../context/Socket.context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <SocketProvider>
        <Component {...pageProps} />
      </SocketProvider>
    </ChakraProvider>
  );
}

export default MyApp;
