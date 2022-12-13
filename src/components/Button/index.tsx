import { TouchableOpacityProps } from "react-native";
import { Loading } from "../Loading";
import { Container, Title, ButtonTypeStyleProps } from "./styles";

type Props = TouchableOpacityProps & {
  type?: ButtonTypeStyleProps;
  title: string;
  isLoading?: boolean;
};

export function Button({ title, type = "PRIMARY", isLoading = false, ...rest }: Props) {
  return (
    <Container type={type} disabled={rest.disabled} {...rest}>
      {isLoading ? <Loading /> : <Title>{title}</Title>}
    </Container>
  );
}
