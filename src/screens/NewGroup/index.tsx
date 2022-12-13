import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { HightLight } from "../../components/HightLight";
import { Input } from "../../components/Input";

import { Container, Content, Icon } from "./styles";
import { groupCreate } from "../../storage/group/groupCreate";
import { AppError } from "../../utils/AppError";
import { Alert } from "react-native";

export function NewGroup() {
  const navigate = useNavigation();
  const [group, setGroup] = useState("");

  async function handleCreateNewGroup() {
    try {
      await groupCreate(group);
      navigate.navigate("players", { group });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Novo Grupo", error.message);
      } else {
        Alert.alert("Novo Grupo", "Não foi possível criar um novo grupo!");
        console.log(error);
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <HightLight title="Nova turma" subtitle="crie a turma para adicionar pessoas" />

        <Input placeholder="Nome da turma" onChangeText={setGroup} />

        <Button
          title="Criar"
          style={{ marginTop: 20 }}
          onPress={handleCreateNewGroup}
          disabled={group.trim().length === 0}
        />
      </Content>
    </Container>
  );
}
