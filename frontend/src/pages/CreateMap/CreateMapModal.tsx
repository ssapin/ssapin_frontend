/* eslint-disable react/jsx-props-no-spreading */
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { MouseEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InfiniteData, QueryObserverResult } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import CancelButton from "../../components/Buttons/CancelButton";
import ConfirmButton from "../../components/Buttons/ConfirmButton";
import FilterChoiceButton from "../../components/Buttons/FilterChoiceButton";
import SwitchButton from "../../components/Buttons/SwitchButton";
import ModalContainer from "../../components/containers/ModalContainer";
import WarningContainer from "../../components/containers/WarningContainer";
import EmojiKeyBoard from "../../components/etc/EmojiKeyboard";
import { campusState } from "../../store/atom";
import axiosInstance from "../../utils/apis/api";
import { getMap, MAP_APIS } from "../../utils/apis/mapApi";
import { CAMPUS_LIST } from "../../utils/constants/contant";
import { countEmojis } from "../../utils/functions/emoji";

interface ModalProps {
  mapId?: number;
  onClose: () => void;
  refetch?: () => Promise<
    QueryObserverResult<
      InfiniteData<
        | {
            result: any;
            page: any;
          }
        | undefined
      >,
      unknown
    >
  >;
}

const Container = styled.div`
  max-width: 800px;
  height: 100%;
  max-height: 83vh;
  overflow-y: scroll;
  background-color: transparent;
  font-size: ${(props) => props.theme.fontSizes.h5};
  color: ${(props) => props.theme.colors.gray900};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  .title {
    font-size: ${(props) => props.theme.fontSizes.h2};
    text-align: center;
    font-family: ${(props) => props.theme.fontFamily.h2bold};
    margin-bottom: 2rem;
  }
  .s1 {
    font-size: ${(props) => props.theme.fontSizes.s2};
    text-align: right;
  }
`;
const DivBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: fit-content;
`;

const FilterBox = styled.div`
  padding: 0.5rem;
`;

const Content = styled.div<{ edit: boolean }>`
  width: 45%;
  select {
    width: 100%;
    height: 35px;
    background-color: ${(props) =>
      props.edit
        ? props.theme.colors.gray200
        : props.theme.colors.lightLightBlue};
    border: 0;
    border-radius: 10px;
    margin: 0.5rem;
    outline: none;
    color: ${(props) => props.theme.colors.gray700};
    text-align: center;
    font-size: ${(props) => props.theme.fontSizes.paragraph};
    font-family: ${(props) => props.theme.fontFamily.h5};
  }
`;

const SubTitle = styled.h5`
  font-size: ${(props) => props.theme.fontSizes.paragraph};
  color: ${(props) => props.theme.colors.gray900};
  font-family: ${(props) => props.theme.fontFamily.h5};
  margin-left: 10px;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  button {
    margin: 0.2rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 35px;
  background-color: ${(props) => props.theme.colors.lightLightBlue};
  border: 0;
  border-radius: 10px;
  margin: 0.5rem;
  outline: none;
  color: ${(props) => props.theme.colors.gray700};
  text-align: center;
  font-size: ${(props) => props.theme.fontSizes.paragraph};
  font-family: ${(props) => props.theme.fontFamily.h5};
  :focus {
    outline: 2px solid ${(props) => props.theme.colors.lightBlue};
  }
  :disabled {
    background-color: ${(props) => props.theme.colors.gray200};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.gray400};
    text-align: center;
    font-size: ${(props) => props.theme.fontSizes.paragraph};
    font-family: ${(props) => props.theme.fontFamily.h5};
  }
`;

export const WarnDiv = styled.div`
  height: 1.5rem;
  padding: 0 1rem;
  display: flex;
`;

export interface FormValues {
  title: string;
  emoji: string;
  campus: number;
}

const EmojikeyboardContainer = styled.div`
  position: absolute;
`;

function CreateMapModal({ onClose, mapId, refetch }: ModalProps) {
  const [hashTag, setHashTag] = useState([]);
  const campus = CAMPUS_LIST;
  const defaultCampusId = useRecoilValue(campusState);
  const [access, setAccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isKeyboard, setIsKeyboard] = useState(false);
  const [emoji, setEmoji] = useState<string>("");
  const [length, setLength] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      emoji: "",
      campus: defaultCampusId,
    },
  });

  const onFail = () => {
    setError("emoji", {
      message: "???????????? 1??? ?????? 3???????????? ?????? ???????????? ~",
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isEdit) {
      const body = {
        access,
        mapId,
        hashtagList: hashTag,
      };
      try {
        const response = await axiosInstance.patch(MAP_APIS.MAP, body);
        if (response.status === 200) {
          // eslint-disable-next-line no-alert
          onClose();
        }
      } catch (error: unknown) {
        alert(`?????????????????????.`);
        refetch();
        if (error instanceof AxiosError) {
          if (error.response.status === 400) {
            setError("emoji", { message: "???????????? ??????????????????.???? ????" });
          }
        }
      }
    } else {
      const body = {
        campusId: data.campus,
        title: data.title,
        emoji: data.emoji,
        access,
        hashtagList: hashTag,
      };
      try {
        const response = await axiosInstance.post(MAP_APIS.MAP, body);

        if (response.status === 200) {
          navigate(`/maps/${response?.data}/detail`);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response.status === 400) {
            setError("emoji", { message: "???????????? ??????????????????.???? ????" });
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!mapId) return;
    getMap(mapId).then((data) => {
      setValue("campus", data.campusId);
      setValue("emoji", data.mapEmoji);
      setValue("title", data.title);
      setEmoji(data.mapEmoji);
      setAccess(data.access);
      setLength(countEmojis(data.mapEmoji));
      // eslint-disable-next-line array-callback-return
      data.hashtagList.map((hashtag: any) => {
        hashTag.push(hashtag.hashtagId);
      });
      setIsEdit(true);
    });
  }, [mapId]);
  useEffect(() => {
    setLength(countEmojis(emoji));
    setValue("emoji", emoji);
  }, [length, emoji]);
  const onChangeTag = (checked: any, item: any) => {
    if (checked) {
      setHashTag([...hashTag, item]);
    } else if (!checked) {
      setHashTag(hashTag.filter((el: any) => el !== item));
    }
  };

  const onChangeAccess = (e: boolean) => {
    setAccess(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmoji(e.target.value);
  };
  const isVisibleKeyboard = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setIsKeyboard(!isKeyboard);
  };

  const checkCharCode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keycode = e.key;

    if (keycode !== "Backspace") {
      e.preventDefault();
    } else if (keycode === "Backspace" && length !== 0) setLength(length - 1);
  };

  return (
    <ModalContainer onClose={onClose}>
      <Container onClick={() => setIsKeyboard(false)}>
        <Form onSubmit={handleSubmit(onSubmit, onFail)}>
          {isEdit ? (
            <p className="title">??????????????????</p>
          ) : (
            <p className="title">???????????????</p>
          )}
          <DivBox>
            <Content edit={isEdit}>
              <SubTitle>??????</SubTitle>
              <Input
                {...register("title", {
                  required: true,
                  maxLength: 20,
                })}
                placeholder="ex) ?????? ?????? ?????? ????????? ??????"
                disabled={isEdit}
                maxLength={20}
              />
              <WarnDiv>
                {errors.title && (
                  <WarningContainer text="20??? ????????? ??????????????????." />
                )}
              </WarnDiv>
            </Content>
            <Content edit={isEdit}>
              <SubTitle>?????????</SubTitle>

              <select
                name="campus"
                {...register("campus", { required: true })}
                disabled={isEdit}
              >
                {campus.map(
                  (option, idx) =>
                    idx >= 1 && (
                      <option key={option} value={idx}>
                        {option}
                      </option>
                    ),
                )}
              </select>
            </Content>
          </DivBox>
          <DivBox>
            <Content edit={isEdit}>
              <SubTitle>????????????</SubTitle>
              <SwitchButton
                textLeft="?????? ?????????!"
                textRight="?????? ?????????!"
                type={access}
                func={onChangeAccess}
              />
            </Content>
            <Content edit={isEdit}>
              <SubTitle>?????????(3?????????)</SubTitle>
              <Input
                {...register("emoji", {
                  validate: {
                    positive: () => length > 0,
                    lessThenThree: () => length < 4,
                  },
                })}
                disabled={isEdit}
                placeholder="ex) ????????????"
                onClick={isVisibleKeyboard}
                onChange={handleChange}
                value={emoji}
                onKeyDown={checkCharCode}
                autoComplete="off"
              />
              {isKeyboard ? (
                <EmojikeyboardContainer onClick={(e) => e.stopPropagation()}>
                  <EmojiKeyBoard emoji={emoji} setEmoji={setEmoji} />
                </EmojikeyboardContainer>
              ) : null}
              <WarnDiv>
                {errors.emoji && (
                  <WarningContainer text={errors.emoji.message} />
                )}
              </WarnDiv>
            </Content>
          </DivBox>
          <FilterBox>
            <FilterChoiceButton
              type="create"
              func={onChangeTag}
              hashTag={hashTag}
            />
          </FilterBox>
          <Flex>
            <ConfirmButton
              type="submit"
              text={isEdit ? "????????????" : "?????????"}
            />
            <CancelButton type="button" text="??????" func={onClose} />
          </Flex>
        </Form>
      </Container>
    </ModalContainer>
  );
}

export default CreateMapModal;
