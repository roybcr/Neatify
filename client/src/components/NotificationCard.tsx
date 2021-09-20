import * as React from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react";
import { NotificationStatus } from "../types";

type Status = Exclude<NotificationStatus, "">;

interface INot {
  id: string;
  message: string;
  type: NotificationStatus;
  onBlock: (id: string) => void;
}

export const NotificationCard = ({ ...props }: INot) => {
  const { id, message, type, onBlock } = props;
  const [currentType, setCurrentType] = React.useState<Status>();
  React.useEffect(() => {
    if (type !== "") {
      setCurrentType(type);
    }
  }, [type]);
  return (
    <Alert
      status={currentType}
      flexDirection="column"
      alignItems="center"
      variant="left-accent"
      rounded="8px"
      justifyContent="center"
      textAlign="center"
      height="200px">
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {type.toUpperCase()}
      </AlertTitle>
      <AlertDescription maxWidth="sm">{message}</AlertDescription>
      <CloseButton
        _focus={{ outline: "none" }}
        position="absolute"
        right="8px"
        top="8px"
        onClick={() => onBlock(id)}
      />
    </Alert>
  );
};

export default NotificationCard;
