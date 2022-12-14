import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPlaceInfo } from "../../utils/apis/placeApi";
import { makePin } from "../../utils/functions/maps";
import PlaceInfoModal from "./PlaceInfoModal";
import "../../styles/style.css";
import NavToggleContainer from "../../components/etc/NavToggleContainer";
import BackButton from "../../components/Buttons/BackButton";

const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 1;
  position: relative;
`;

const NavContainer = styled.div`
  position: fixed;
  z-index: 2;
  top: 10px;
  right: 10px;
`;

const BackContainer = styled.div`
  position: fixed;
  z-index: 2;
  top: 10px;
  left: 10px;
`;

const { kakao } = window;

function SharedPlaceDetail() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { placeId } = useParams();
  const mapRef = useRef<HTMLDivElement>();
  const { data: placeData } = useQuery(["place", placeId], () =>
    getPlaceInfo(Number(placeId)),
  );

  const addMarker = async (position: any, map: any) => {
    const marker = new kakao.maps.Marker({
      position,
    });
    marker.setMap(map);
    const cont = makePin(placeData, "📍", () => setCreateModalOpen(true));
    await new kakao.maps.CustomOverlay({
      map,
      position,
      content: cont,
      yAnchor: 2,
    });
    return marker;
  };

  useEffect(() => {
    if (!placeData) return;
    (async () =>
      kakao.maps.load(async () => {
        const mapContainer = mapRef.current;
        const position = await new kakao.maps.LatLng(
          placeData?.lat,
          placeData?.lng,
        );
        const options = {
          center: position,
          level: 3,
        };

        const map = await new kakao.maps.Map(mapContainer, options);
        addMarker(position, map);
        setTimeout(() => {
          setCreateModalOpen(true);
        }, 1000);
      }))();
  }, [placeData]);

  return (
    <>
      <Helmet>
        <title>{placeData ? `${placeData.title} - SSAPIN` : "SSAPIN"}</title>
      </Helmet>
      <BackContainer>
        <BackButton type="main" />
      </BackContainer>
      <NavContainer>
        <NavToggleContainer />
      </NavContainer>
      <MapContainer ref={mapRef} />
      {createModalOpen && (
        <PlaceInfoModal
          placeId={Number(placeId)}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
    </>
  );
}

export default SharedPlaceDetail;
