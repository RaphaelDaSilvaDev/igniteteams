import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "../../utils/AppError";
import { GROUP_COLLECTION } from "../storageConfig";
import { groupsGetAll } from "./groupGetAllGroups";

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
