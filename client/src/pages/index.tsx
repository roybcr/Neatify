import { Box, Flex, ScaleFade, Spinner, Text } from "@chakra-ui/react";
import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import React, { useState, useEffect } from "react";
import { useSocket } from "../context/Socket.context";
import { NotificationStatus } from "../types";
import NotificationCard from "../components/NotificationCard";

const Index = () => {
  const { socket, notification } = useSocket();
  const [shouldShow, setShouldShow] = useState<boolean>(false);

  const onBlockEvent = (id: string) => {
    setShouldShow(false);
    socket.emit("block", { data: id });
  };
  useEffect(() => {
    if (notification) {
      if (notification._id === "-1" || notification.message === "" || notification.type === "") {
        setShouldShow(false);
      } else {
        setShouldShow(true);
      }
    } else {
      setShouldShow(false);
    }
  }, [notification]);

  useEffect(() => {
    socket.on("connection", (data: string) => {
      socket.emit("identity", { message: data });
    });
  }, []);

  return (
    <Container height="100vh">
      <Hero />
      <Box
        width="100%"
        h="2xs"
        p={"6"}
        border={"2px dashed #e2e2e2"}
        display="flex"
        rounded="md"
        justify="center"
        align="center"
        maxW="3xl">
        {!notification || notification._id === "-1" ? (
          <Flex w="full" height="full" align="center" justify="center">
            <Spinner speed="0.45s" size="xs" />
            <Text fontSize="xs" fontWeight="400" ml={2}>
              Waiting for notifications...
            </Text>
          </Flex>
        ) : (
          notification && (
            <Box w="full" h="full">
              <ScaleFade initialScale={0.7} in={shouldShow} reverse={true} unmountOnExit={true}>
                <NotificationCard
                  id={notification._id}
                  message={notification.message}
                  type={notification.type as NotificationStatus}
                  onBlock={onBlockEvent}
                />
              </ScaleFade>
            </Box>
          )
        )}
      </Box>
    </Container>
  );
};

export default Index;
