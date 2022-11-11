import styled from "@emotion/styled";

import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Helmet } from "react-helmet-async";
import BackButton from "../../components/Buttons/BackButton";
import CreateButton from "../../components/Buttons/CreateButton";
import ModalPortal from "../../components/containers/ModalPortalContainer";
import { authState, campusState, userInformationState } from "../../store/atom";
import axiosInstance from "../../utils/apis/api";
import { getMap, IBookMark, MAP_APIS } from "../../utils/apis/mapApi";
import {
  CAMPUS_COORDINATE_LIST,
  CAMPUS_LIST,
} from "../../utils/constants/contant";
import { isUserAccess } from "../../utils/functions/place";
import { IMap } from "../../utils/types/map.interface";
import LoginModal from "../Login/LoginModal";
import "../../styles/style.css";
import PlaceCard from "../../components/card/PlaceCard";
import { getCurrentLocation } from "../../utils/functions/getCurrentLocation";
import PlaceInfoModal from "../Place/PlaceInfoModal";
import MapCircleButton from "../../components/Buttons/MapCircleButton";
import KakaoShareButton from "../../components/Buttons/KakaoShareButton";
import CopyModalContainer from "../../components/containers/CopyModalContainer";
import { copyURL } from "../../utils/functions/copyURL";
import CreateButtonMobile from "../../components/Buttons/CreateButtonMobile";
import { makePin } from "../../utils/functions/maps";

import MapTitleCard from "../../components/card/MapTitleCard";
import NavToggleContainer from "../../components/etc/NavToggleContainer";
import { Mobile } from "../../components/containers/MediaQueryContainer";

declare global {
  interface Window {
    kakao: any;
  }
}

const { kakao } = window;

const Container = styled.section`
  position: relative;
  overflow: hidden;
`;

const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 1;
  position: relative;
`;

const ButtonContainer = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BackContainer = styled.div`
  position: fixed;
  z-index: 2;
  top: 10px;
  left: 10px;
`;

const SubjectContainer = styled(BackContainer)`
  margin: 0 auto;
  left: 0;
  right: 0;
  width: fit-content;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  > div {
    &:nth-child(2) {
      ${(props) => props.theme.mq.mobile} {
        display: none;
      }
    }
  }
`;

const PlaceListContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 10px;
  width: 300px;
  height: 80vh;
  overflow-y: scroll;
  z-index: 2;
  > ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 90%;
    margin-left: auto;
  }
  ${(props) => props.theme.mq.tablet} {
    top: 60vh;
    margin: 0 auto;
    left: 0;
    right: 0;
    > ul {
      width: 100%;
    }
  }
`;

const NavContainer = styled.div`
  position: fixed;
  z-index: 2;
  top: 10px;
  right: 10px;
`;

const ButtonListContainer = styled.div`
  position: fixed;
  z-index: 2;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  > div {
    display: flex;
    gap: 0.5rem;
    ${(props) => props.theme.mq.mobile} {
      flex-direction: column;
    }
  }
`;

type Coordinate = [number, number];

function Map() {
  const mapRef = useRef<HTMLDivElement>();
  const [mapObj, setMapObj] = useState({ map: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [placeId, setPlaceId] = useState<number>();

  const userInformation = useRecoilValue(userInformationState);
  const [LoginmodalOpen, setLoginModalOpen] = useState(false);
  const auth = useRecoilValue(authState);
  const userCampusId = useRecoilValue(campusState);
  const [copied, setCopied] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { data: mapData, refetch: mapRefetch } = useQuery<IMap, AxiosError>(
    ["map", mapId],
    () => getMap(Number(mapId)),
  );

  const locateSSAFY = (position: any, map: any) => {
    const imageSrc =
      "https://trippiece607.s3.ap-northeast-2.amazonaws.com/building.png";
    const imageSize = new kakao.maps.Size(30, 40);
    const imgOptions = {};
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions,
    );
    const marker = new kakao.maps.Marker({
      position,
      image: markerImage,
    });
    marker.setMap(map);
    return marker;
  };

  const addMarker = (position: any) => {
    const marker = new kakao.maps.Marker({
      position,
    });
    marker.setMap(mapObj.map);
    return marker;
  };

  const openModal = (id: number) => {
    setModalOpen(true);
    setPlaceId(id);
  };

  const panTo = async () => {
    try {
      const response: GeolocationPosition =
        (await getCurrentLocation()) as GeolocationPosition;
      const [lat, lng] = [response.coords.latitude, response.coords.longitude];
      const myPosition = new kakao.maps.LatLng(lat, lng);

      mapObj.map?.panTo(myPosition);

      setTimeout(() => {
        mapObj.map?.setLevel(2, {
          animate: {
            duration: 500,
          },
        });
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isUserAccess(userInformation.userId, mapData?.userId)) {
      setIsCreator(true);
    }
    (async () =>
      kakao.maps.load(async () => {
        const campusLocation = mapData
          ? CAMPUS_LIST[Number(mapData.campusId)]
          : CAMPUS_LIST[userCampusId];

        const [lat, lan]: Coordinate = [
          +CAMPUS_COORDINATE_LIST[campusLocation].y,
          +CAMPUS_COORDINATE_LIST[campusLocation].x,
        ];

        const mapContainer = mapRef.current;
        const position = await new kakao.maps.LatLng(lat, lan);
        const options = {
          center: position,
          level: 3,
        };

        // const campusName = CAMPUS_COORDINATE_LIST[campusLocation];
        const map = await new kakao.maps.Map(mapContainer, options);
        locateSSAFY(position, map);
        // const img = "";
        const content = makePin(
          {
            title: CAMPUS_COORDINATE_LIST[campusLocation].place_name,
            placeId: 0,
          },
          "🗼",
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const customOverlay = new kakao.maps.CustomOverlay({
          map,
          position,
          content,
          yAnchor: 2,
        });
        setMapObj({ map });
      }))();
  }, []);

  useEffect(() => {
    if (!mapData) return;
    if (!mapObj.map) return;
    if (!mapData?.placeList || mapData.placeList.length < 1) return;
    (async () => {
      const bounds = await new kakao.maps.LatLngBounds();
      mapData.placeList.forEach(async (place) => {
        const placePosition = new kakao.maps.LatLng(place.lat, place.lng);
        bounds.extend(placePosition);
        addMarker(placePosition);
        const cont = makePin(place, place.userEmoji, openModal);
        await new kakao.maps.CustomOverlay({
          map: mapObj.map,
          position: placePosition,
          content: cont,
          yAnchor: 2,
        });
      });
      mapObj.map?.setBounds(bounds);
    })();
  }, [mapData, mapObj]);

  const addNewPlace = () => {
    if (auth.accessToken) navigate(`/maps/${mapId}/new`);
    else setLoginModalOpen(true);
  };

  const registerBookmark = async () => {
    const body: IBookMark = {
      mapId: Number(mapId),
    };

    try {
      await axiosInstance.post(MAP_APIS.BOOKMARK, body).then(() => {
        mapRefetch();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeBookmark = async () => {
    const body: IBookMark = {
      mapId: Number(mapId),
    };

    try {
      await axiosInstance.delete(MAP_APIS.BOOKMARK, { data: body }).then(() => {
        mapRefetch();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const copy = () => {
    setCopied(true);
    copyURL();
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>
          {mapData?.title ? `${mapData?.title} - SSAPIN` : "SSAPIN"}
        </title>
      </Helmet>
      <Container>
        <PlaceListContainer>
          <ul>
            {mapData?.placeList &&
              mapData.placeList.map((place) => (
                <PlaceCard
                  prop={place}
                  key={place.placeId}
                  isAdmin
                  mapId={mapData.mapId}
                />
              ))}
          </ul>
        </PlaceListContainer>
        <ButtonListContainer>
          <MapCircleButton type="button" shape="4" height="50px" func={panTo} />
          <div>
            <MapCircleButton
              type="button"
              shape="1"
              height="50px"
              func={copy}
            />
            <KakaoShareButton />
          </div>
        </ButtonListContainer>

        <ButtonContainer>
          <Mobile>
            {mapData?.bookMark ? (
              <MapCircleButton shape="3" func={removeBookmark} />
            ) : (
              <MapCircleButton shape="2" func={registerBookmark} />
            )}
          </Mobile>
          {(mapData?.access || isCreator) && (
            <>
              <CreateButton
                text="장소 추가하기"
                type="button"
                func={addNewPlace}
              />
              <CreateButtonMobile
                text="장소 추가하기"
                type="button"
                func={addNewPlace}
              />
            </>
          )}
        </ButtonContainer>
        <BackContainer>
          <BackButton />
        </BackContainer>
        <SubjectContainer>
          <MapTitleCard
            user={`${mapData?.userEmoji} ${mapData?.nickname}`}
            title={`${mapData?.mapEmoji.substring(0, 2)}${mapData?.title}`}
          />
          <div>
            {mapData?.bookMark ? (
              <MapCircleButton shape="3" func={removeBookmark} />
            ) : (
              <MapCircleButton shape="2" func={registerBookmark} />
            )}
          </div>
        </SubjectContainer>

        <NavContainer>
          <NavToggleContainer />
        </NavContainer>

        {LoginmodalOpen && (
          <ModalPortal>
            <LoginModal onClose={() => setLoginModalOpen(false)} />
          </ModalPortal>
        )}
        {modalOpen && (
          <ModalPortal>
            <PlaceInfoModal
              placeId={placeId}
              onClose={() => setModalOpen(false)}
            />
          </ModalPortal>
        )}
        {copied && (
          <ModalPortal>
            <CopyModalContainer onClose={() => setCopied(false)}>
              <p>💻URL을 클립보드에 복사했어요.</p>
            </CopyModalContainer>
          </ModalPortal>
        )}
        <MapContainer ref={mapRef} />
      </Container>
    </>
  );
}

export default Map;
