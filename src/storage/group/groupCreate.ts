import AsyncStorage from "@react-native-async-storage/async-storage";
import { groupsGetAll } from "./groupGetAllGroups";

import { GROUP_COLLECTION } from "../storageConfig";
import { AppError } from "../../utils/AppError";

export async function groupCreate(groupName: string) {
  try {
    const storedGroups = await groupsGetAll();
    const groupAlreadyExists = storedGroups.includes(groupName);

    if (groupAlreadyExists) {
      throw new AppError("Já existe um grupo com esse nome!");
    }

    const storage = JSON.stringify([...storedGroups, groupName]);
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}
