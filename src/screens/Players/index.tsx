import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Button } from "../../components/Button";
import { Filter } from "../../components/Filter";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { ListEmpty } from "../../components/ListEmpty";
import { ButtonIcon } from "../../components/ButtonIcon";
import { HightLight } from "../../components/HightLight";
import { PlayerCard } from "../../components/PlayerCard";

import { PlayerDTO } from "../../storage/player/types";
import { playerCreateByGroup } from "../../storage/player/playerCreateByGroup";
import { playerRemoveByGroup } from "../../storage/player/playerRemoveByGroup";
import { playerGetByGroupAndTeam } from "../../storage/player/playerGetByGroupAndTeam";

import { AppError } from "../../utils/AppError";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { groupRemoveByName } from "../../storage/group/groupRemoveByName";

type RouteParams = {
  group: string;
};

export function Players() {
  const newPlayerInputRef = useRef<TextInput>(null);
  const navigate = useNavigation();
  const [playerName, setPlayerName] = useState("");
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState<PlayerDTO[]>([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  async function handleAddPlayer() {
    if (playerName.trim().length === 0) {
      return Alert.alert("Novo player", "Informe o nome do player!");
    }

    const newPlayer = {
      name: playerName,
      team,
    };

    try {
      await playerCreateByGroup(newPlayer, group);

      newPlayerInputRef.current?.blur();
      fetchPlayersByTeam();
      setPlayerName("");
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Novo player", error.message);
      } else {
        Alert.alert("Novo player", "Não foi possível adicionar o player!");
        console.log(error);
      }
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert("Player", "Não foi possível remover o player!");
    }
  }

  async function fetchPlayersByTeam() {
    try {
      const players = await playerGetByGroupAndTeam(group, team);
      setPlayers(players);
    } catch (error) {
      console.log(error);
      Alert.alert("Players", "Não foi possível carregar os Players");
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigate.navigate("groups");
    } catch (error) {
      console.log(error);
      Alert.alert("Grupo", "Não foi possível remover o grupo!");
    }
  }

  async function handleRemoveGroup() {
    Alert.alert("Remover", `Deseja remover o grupo ${group}?`, [
      { text: "Não", style: "cancel" },
      { text: "Remover", onPress: groupRemove },
    ]);
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <HightLight title={group} subtitle="adicione a galera e separe os times" />

      <Form>
        <Input
          inputRef={newPlayerInputRef}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          value={playerName}
          onChangeText={setPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter title={item} isActive={item === team} onPress={() => setTeam(item)} />
          )}
          horizontal
        />
        <NumbersOfPlayers>{players.length}</NumbersOfPlayers>
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PlayerCard name={item.name} onRemove={() => handleRemovePlayer(item.name)} />
        )}
        ListEmptyComponent={() => <ListEmpty message="Não há pessoas nesse time" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={players.length === 0 && { flex: 1 }}
      />

      <Button
        title="Remover Turma"
        type="SECONDARY"
        style={{ marginTop: 20 }}
        onPress={handleRemoveGroup}
      />
    </Container>
  );
}
