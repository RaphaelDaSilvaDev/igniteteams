import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "../storageConfig";

import { playerGetByGroup } from "./playerGetByGroup";

import { AppError } from "../../utils/AppError";
import { PlayerDTO } from "./types";

export async function playerCreateByGroup(newPlayer: PlayerDTO, group: string) {
  try {
    const storedPlayers = await playerGetByGroup(group);
    const playerAlreadyExists = storedPlayers.filter((player) => player.name === newPlayer.name);

    if (playerAlreadyExists.length > 0) {
      throw new AppError(`O player ${newPlayer.name} já está em um time!`);
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer]);

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
  } catch (error) {
    throw error;
  }
}
