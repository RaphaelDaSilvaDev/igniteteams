import { useNavigation } from "@react-navigation/native";

import { Container, Logo, ButtonContainer, BackButton, BackIcon } from "./styles";
import logoImg from "../../assets/logo.png";

type props = {
  showBackButton?: boolean;
};

export function Header({ showBackButton = false }: props) {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.navigate("groups");
  }

  return (
    <Container>
      {showBackButton && (
        <ButtonContainer>
          <BackButton onPress={handleGoBack}>
            <BackIcon />
          </BackButton>
        </ButtonContainer>
      )}
      <Logo source={logoImg} />
    </Container>
  );
}
