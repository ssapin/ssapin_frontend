import TogetherMapCard from "../../components/card/TogetherMapCard";
import MainDescriptionContainer from "../../components/containers/MainDescriptionContainer";
import MainNoDataContainer from "../../components/containers/MainNoDataContainer";
import MainTitleContainer from "../../components/containers/MainTitleContainer";
import MainCardListContainer from "../../components/containers/MainCardListContainer";
import { ITogetherMap } from "../../utils/types/togethermap.interface";
import IntersectSectionContainer from "../../components/containers/IntersectSectionContainer";

interface TogetherMapListProps {
  togetherData: ITogetherMap[];
}
function TogetherMapList({ togetherData }: TogetherMapListProps) {
  return (
    <IntersectSectionContainer>
      <MainTitleContainer>
        <>
          πͺ <span>λͺ¨μ¬μ§λ</span>
        </>
      </MainTitleContainer>
      <MainDescriptionContainer>
        <p>νλ§λ³ μμ μ λ² μ€νΈ 1μ! μ₯μλ₯Ό λ±λ‘ν΄λ³΄μΈμ π₯³</p>
      </MainDescriptionContainer>
      <MainCardListContainer>
        {togetherData?.length !== 0 &&
          togetherData?.map((map) => (
            <TogetherMapCard key={map.togethermapId} prop={map} />
          ))}
      </MainCardListContainer>
      {togetherData?.length === 0 && (
        <MainNoDataContainer>
          <p>μμ§ μ₯μκ° μλ λͺ¨μ¬μ§λκ° μμ΄μ π₯</p>
        </MainNoDataContainer>
      )}
    </IntersectSectionContainer>
  );
}

export default TogetherMapList;
