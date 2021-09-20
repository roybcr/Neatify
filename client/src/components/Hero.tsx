import { Flex, Heading } from "@chakra-ui/react";

export const Hero = ({ title }: { title: string }) => (
  <Flex
    justifyContent="flex-start"
    alignItems="left"
    px={12}
    py={6}
    bgGradient="linear(to-l, #4265ff, #7cc0ff)"
    bgClip="text">
    <Heading fontSize="2vw" fontFamily="SF Pro Display">
      {title}
    </Heading>
  </Flex>
);

Hero.defaultProps = {
  title: "Neatify ⚡️",
};
