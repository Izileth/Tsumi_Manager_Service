import { Pressable, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
interface ActivateFeedButtonProps {
  onPress: () => void;
  className?: string;
}

export function ActivateFeedButton({ onPress, className }: ActivateFeedButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-8 mb-16 mx-auto px-6 py-3 rounded-full shadow-lg flex-row items-center"
    > 
      <Text className="text-zinc-300 text-lg font-semibold mr-2">Ver Feed</Text>
      <ChevronDown size={24} color="white" />
    </Pressable>
  );
}
