import styled from "@emotion/styled";

type HotPlaceProps = {
  place: string;
  address: string;
  message: string;
  // eslint-disable-next-line react/require-default-props
  func?: () => void;
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.gray0};
  border-radius: 10px;
  margin: 1rem;
  width: 22rem;
  height: 9rem;
  box-shadow: 1px 3px 12px 0px ${(props) => props.theme.colors.gray300};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;

  .place {
    text-align: center;
    font-size: ${(props) => props.theme.fontSizes.h4};
    color: ${(props) => props.theme.colors.gray900};
    font-family: ${(props) => props.theme.fontFamily.h4bold};
  }

  .address {
    margin-top: 0.4rem;
    text-align: center;
    font-size: ${(props) => props.theme.fontSizes.s2};
    color: ${(props) => props.theme.colors.gray500};
    font-family: ${(props) => props.theme.fontFamily.s2};
  }

  .message {
    margin-top: 1.5rem;
    font-size: ${(props) => props.theme.fontSizes.s1};
    color: ${(props) => props.theme.colors.mainBlue};
    font-family: ${(props) => props.theme.fontFamily.s1bold};
  }

  :hover {
    scale: 1.06;
    cursor: pointer;
  }
`;

function HotPlaceCard({ place, address, message, func }: HotPlaceProps) {
  return (
    <Container onClick={func}>
      <p className="place">{place}</p>
      <p className="address">{address}</p>
      <p className="message">{message}</p>
    </Container>
  );
}

export default HotPlaceCard;
