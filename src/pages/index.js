import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Container,
  Heading,
  HStack,
  Box,
  Flex,
  Spinner,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Chat = () => {
  const [iterations, setIterations] = useState([
    { text: "", loading: false },
  ]);
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [refineGoal, setRefineGoal] = useState("");

  const handleSubmit = async (index) => {
    setIterations([
      ...iterations.slice(0, index),
      { ...iterations[index], loading: true },
      ...iterations.slice(index + 1),
    ]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refine_goal: refineGoal,
        initial_text: iterations[0].text,
        previous_text: iterations[index].text,
      }),
    });

    const { choices } = await res.json();
    const generatedText = choices[0]?.message?.content || "";

    setIterations([
      ...iterations.slice(0, index + 1),
      {
        text: generatedText,
        loading: false,
      },
      ...iterations.slice(index + 2),
    ]);
  };

  useEffect(() => {
    if (iterations.length > 0 && autoRepeat) {
      const lastIndex = iterations.length - 1;
      if (
        !iterations[lastIndex].loading &&
        iterations[lastIndex].text !== "" &&
        iterations.length <= 20
      ) {
        handleSubmit(lastIndex);
      }
    }
  }, [iterations, autoRepeat]);

  return (
    <Container maxW="container.lg">
      <Box position="sticky" top={0} zIndex={10} bg="white" p={0} pb={2} pt={4} mb={2}  borderBottom="1px solid #e2e8f0">
        <HStack mb={2}>
          <Text as="b">Self-Refine Iteration Loop ✨</Text>
          <Switch
            colorScheme="teal"
            isChecked={autoRepeat}
            onChange={(e) => setAutoRepeat(e.target.checked)}
          />
        </HStack>
        <FormControl mb={2}>
          <FormLabel fontSize="xs">Goal</FormLabel>
          <Input
            size="sm"
            fontSize="sm"
            value={refineGoal}
            onChange={(e) => setRefineGoal(e.target.value)}
          />
        </FormControl>
      </Box>
      {iterations.map(({ text, loading }, index) =>
        index <= 19 ? (
          <VStack spacing={1} key={index} mb={3}>
            <HStack width="full">
              <FormControl flex="1">
                <FormLabel fontSize="xs">Iteration {index + 1}</FormLabel>
                <Textarea
                  size="sm"
                  fontSize="sm"
                  h="80px"
                  value={text}
                  onChange={(e) =>
                    setIterations([
                      ...iterations.slice(0, index),
                      {
                        text: e.target.value,
                        loading,
                      },
                      ...iterations.slice(index + 1),
                    ])
                  }
                />
              </FormControl>
            </HStack>
            <Flex width="full" align="flex-end">
              {loading && <Spinner ml={2} />}
            </Flex>
          </VStack>
        ) : null
      )}
    </Container>
  );
};

export default Chat;