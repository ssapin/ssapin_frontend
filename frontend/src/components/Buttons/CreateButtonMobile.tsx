import React from "react";
import styled from "@emotion/styled";
import { IButtonProps } from "../../utils/interfaces/buttons.interface";
import { ReactComponent as PlusIcon } from "../../assets/svgs/plus.svg";

const StyledCreate = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 7vh;
  height: 7vh;
  background-color: ${(props) => props.theme.colors.lightBlue};
`;

export default function CreateButtonMobile({
  type,
  func,
  disabled,
}: IButtonProps) {
  return (
    <StyledCreate type={type} onClick={func} disabled={disabled}>
      <PlusIcon />
    </StyledCreate>
  );
}