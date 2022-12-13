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
import { groupRemoveByName } from "../../storage/group/groupRemoveByName";
import { playerCreateByGroup } from "../../storage/player/playerCreateByGroup";
import { playerRemoveByGroup } from "../../storage/player/playerRemoveByGroup";
import { playerGetByGroupAndTeam } from "../../storage/player/playerGetByGroupAndTeam";

import { AppError } from "../../utils/AppError";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { Loading } from "../../components/Loading";

type RouteParams = {
  group: string;
};

export function Players() {
  const newPlayerInputRef = useRef<TextInput>(null);
  const navigate = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState<PlayerDTO[]>([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  async function handleAddPlayer() {
    if (playerName.trim().length === 0) {
      return Alert.alert("Nova pessoa", "Informe o nome da pessoa!");
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
        Alert.alert("Nova pessoa", error.message);
      } else {
        Alert.alert("Nova pessoa", "Não foi possível adicionar a pessoa!");
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
      Alert.alert("Player", "Não foi possível remover a pessoa!");
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const players = await playerGetByGroupAndTeam(group, team);
      setPlayers(players);
    } catch (error) {
      console.log(error);
      Alert.alert("Players", "Não foi possível carregar as pessoas");
    } finally {
      setIsLoading(false);
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigate.navigate("groups");
    } catch (error) {
      console.log(error);
      Alert.alert("Turma", "Não foi possível remover a turma!");
    }
  }

  async function handleRemoveGroup() {
    Alert.alert("Remover", `Deseja remover a turma ${group}?`, [
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

      {isLoading ? (
        <Loading />
      ) : (
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
      )}

      <Button
        title="Remover turma"
        type="SECONDARY"
        style={{ marginTop: 20 }}
        onPress={handleRemoveGroup}
      />
    </Container>
  );
}
