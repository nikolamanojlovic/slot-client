import { VStack } from "@/components/ui/vstack";
import BusinessSearch from "../../molecules/BusinessSearch";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";

const AnonymousCallout = () => {
  return (
    <VStack className="items-center">
      <Heading size="4xl" className="text-center text-primary-500 mt-6 mb-6">
        Discover and book!
      </Heading>
      <Box className="w-[80%]">
        <BusinessSearch />
      </Box>
    </VStack>
  );
};

export default AnonymousCallout;
