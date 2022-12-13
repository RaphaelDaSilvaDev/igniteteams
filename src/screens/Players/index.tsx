import { useState } from "react";
import { Alert, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";

import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Filter } from "../../components/Filter";
import { Header } from "../../components/Header";
import { HightLight } from "../../components/HightLight";
import { Input } from "../../components/Input";
import { ListEmpty } from "../../components/ListEmpty";
import { PlayerCard } from "../../components/PlayerCard";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { AppError } from "../../utils/AppError";
import { playerCreateByGroup } from "../../storage/player/playerCreateByGroup";
import { playerGetByGroup } from "../../storage/player/playerGetByGroup";

type RouteParams = {
  group: string;
};

export function Players() {
  const [playerName, setPlayerName] = useState("");
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState([]);

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
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Novo player", error.message);
      } else {
        Alert.alert("Novo player", "Não foi possível adicionar o player!");
        console.log(error);
      }
    }
  }

  const route = useRoute();
  const { group } = route.params as RouteParams;
  return (
    <Container>
      <Header showBackButton />

      <HightLight title={group} subtitle="adicione a galera e separe os times" />

      <Form>
        <Input placeholder="Nome da pessoa" autoCorrect={false} onChangeText={setPlayerName} />
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
        keyExtractor={(item) => item}
        renderItem={({ item }) => <PlayerCard name={item} onRemove={() => {}} />}
        ListEmptyComponent={() => <ListEmpty message="Não há pessoas nesse time" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={players.length === 0 && { flex: 1 }}
      />

      <Button title="Remover Turma" type="SECONDARY" style={{ marginTop: 20 }} />
    </Container>
  );
}
