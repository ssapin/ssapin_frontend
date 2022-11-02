import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "../../components/Buttons/MenuButton";
import Logo from "../../assets/image/ssapin_logo.png";
import CampusButton from "../../components/Buttons/CampusButton";

const Container = styled.div<{ innerWidth: number }>`
  background-color: ${(props) => props.theme.colors.mainBlue};
  width: 100%;
  height: 15vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(props) =>
    props.innerWidth >= 950
      ? `1rem 0.5rem 0.5rem 1.5rem`
      : `1rem 1rem 0rem 1rem`};
`;

const CampusContainer = styled.div<{ innerWidth: number }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${(props) => props.innerWidth < 950 && `71%`};
  justify-content: flex-start;
`;

const EmptyContainer = styled.div`
  width: 14.5%;
  height: 100%;
`;

const LogoContainer = styled.div<{ innerWidth: number }>`
  width: 100%;
  height: ${(props) => (props.innerWidth >= 950 ? `50%` : `80%`)};
  display: flex;
  flex-direction: ${(props) => (props.innerWidth < 950 ? `column` : `row`)};
  justify-content: ${(props) => props.innerWidth < 950 && `center`};
  margin-bottom: ${(props) => props.innerWidth >= 950 && `0.7rem`};
  text-align: ${(props) => props.innerWidth < 950 && `center`};
  align-items: ${(props) => props.innerWidth < 950 && `center`};

  .logo {
    height: ${(props) => (props.innerWidth >= 950 ? `100%` : `40%`)};
    margin: 0;
    img {
      width: auto;
      height: 100%;
    }
  }

  button {
    height: 35%;
    margin-top: ${(props) => props.innerWidth >= 950 && `2.3rem`};
    margin-left: ${(props) => props.innerWidth >= 950 && `0.5rem`};
    background-color: transparent;
    decoration: none;
    font-family: ${(props) => props.theme.fontFamily.paragraphbold};
    font-size: ${(props) => props.theme.fontSizes.paragraph};
    color: ${(props) => props.theme.colors.subYellow};
  }

  button: hover {
    scale: 1.1;
    cursor: pointer;
  }
`;

const MenuContainer = styled.div<{ innerWidth: number }>`
  width: ${(props) => props.innerWidth < 950 && `14.5%`};
  height: 100%;
`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSide = () => {
    setIsOpen(!isOpen);
  };

  const [btnActive, setBtnActive] = useState(1);
  const toggleActive = (key: number) => {
    setBtnActive(key);
  };
  const campus = ["0", "서울", "대전", "광주", "구미", "부울경"];

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  });

  const navigate = useNavigate();
  const moveToHome = () => {
    navigate("");
  };

  return (
    <Container innerWidth={innerWidth}>
      {innerWidth < 950 && <EmptyContainer />}
      <CampusContainer innerWidth={innerWidth}>
        <LogoContainer innerWidth={innerWidth}>
          <button type="button" onClick={moveToHome} className="logo">
            <img alt="ssapin_logo.png" src={Logo} />
          </button>
          <button type="button" onClick={toggleSide}>
            {campus[btnActive]} ▼
          </button>
        </LogoContainer>
        {isOpen && (
          <CampusButton
            open={toggleSide}
            select={toggleActive}
            campusId={btnActive}
          />
        )}
      </CampusContainer>
      <MenuContainer innerWidth={innerWidth}>
        <MenuButton />
      </MenuContainer>
    </Container>
  );
}
