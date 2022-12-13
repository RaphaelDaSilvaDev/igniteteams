import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Button } from "../../components/Button";
import { GroupCard } from "../../components/GroupCard";
import { Header } from "../../components/Header";
import { HightLight } from "../../components/HightLight";
import { ListEmpty } from "../../components/ListEmpty";

import { Container } from "./styles";
import { groupsGetAll } from "../../storage/group/groupGetAllGroups";

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate("new");
  }

  async function fetchGroups() {
    try {
      const data = await groupsGetAll();
      setGroups(data);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />

      <HightLight title="Turmas" subtitle="Jogue com a sua turma" />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={(item) => <GroupCard title={item.item} />}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={() => <ListEmpty message="Que tal cadastrar a primeira turma?" />}
      />

      <Button title="Criar nova turma" onPress={handleNewGroup} />
    </Container>
  );
}
