import AsyncStorage from "@react-native-async-storage/async-storage";
import { playerGetByGroup } from "./playerGetByGroup";

import { PLAYER_COLLECTION } from "../storageConfig";

export async function playerRemoveByGroup(playerName: string, group: string) {
  try {
    const storage = await playerGetByGroup(group);
    const groupWithOutPlayer = storage.filter((player) => player.name !== playerName);

    const player = JSON.stringify(groupWithOutPlayer);
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, player);
  } catch (error) {
    throw error;
  }
}
