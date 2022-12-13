import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { HightLight } from "../../components/HightLight";

import { groupCreate } from "../../storage/group/groupCreate";

import { Container, Content, Icon } from "./styles";
import { AppError } from "../../utils/AppError";

export function NewGroup() {
  const navigate = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [group, setGroup] = useState("");

  async function handleCreateNewGroup() {
    try {
      if (group.trim().length === 0) {
        throw new AppError("Insira o nome da turma!");
      }
      setLoading(true);
      await groupCreate(group);
      navigate.navigate("players", { group });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Novo turma", error.message);
      } else {
        Alert.alert("Novo turma", "Não foi possível criar uma nova turma!");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <HightLight title="Nova turma" subtitle="crie a turma para adicionar pessoas" />

        <Input
          placeholder="Nome da turma"
          onChangeText={setGroup}
          onSubmitEditing={handleCreateNewGroup}
        />

        <Button
          title="Criar"
          style={{ marginTop: 20 }}
          onPress={handleCreateNewGroup}
          disabled={group.trim().length === 0 || isLoading}
          isLoading={isLoading}
        />
      </Content>
    </Container>
  );
}
