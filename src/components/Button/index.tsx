import { TouchableOpacityProps } from "react-native";
import { Container, Title, ButtonTypeStyleProps } from "./styles";

type Props = TouchableOpacityProps & {
  type?: ButtonTypeStyleProps;
  title: string;
};

export function Button({ title, type = "PRIMARY", ...rest }: Props) {
  return (
    <Container type={type} disabled={rest.disabled} {...rest}>
      <Title>{title}</Title>
    </Container>
  );
}
