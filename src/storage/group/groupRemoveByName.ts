import AsyncStorage from "@react-native-async-storage/async-storage";
import { groupsGetAll } from "./groupGetAllGroups";

import { GROUP_COLLECTION, PLAYER_COLLECTION } from "../storageConfig";

export async function groupRemoveByName(groupName: string) {
  try {
    const stored = await groupsGetAll();
    const groups = await stored.filter((group) => group !== groupName);

    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupName}`);
    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
  } catch (error) {
    throw error;
  }
}
