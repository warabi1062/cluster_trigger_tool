import React from "react";
import {
  Card,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PostAddIcon from "@mui/icons-material/PostAdd";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddCircleOutlineIcond from "@mui/icons-material/AddCircleOutlined";
import { Field, FieldProps, FieldArray } from "formik";
import { TwitterPicker } from "react-color";
import type {
  TriggerState,
  Trigger,
  TriggerColor,
} from "../../../types/Trigger";
import { styled } from "@mui/material/styles";
import State from "./State";

const NameAndCategory = styled("div")`
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin-bottom: 8px;
    &:not(:last-child) {
      margin-right: 16px;
    }
  }
`;

const StyledColorPicker = styled(TwitterPicker)`
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.23) !important;
  width: 280px !important;
`;

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "triggerColor",
})<{ triggerColor: TriggerColor }>`
  position: relative;
  background: linear-gradient(
    270deg,
    #fff 99%,
    ${({ triggerColor }) =>
        `rgb(${triggerColor.r}, ${triggerColor.g}, ${triggerColor.b})`}
      50%,
    ${({ triggerColor }) =>
      `rgb(${triggerColor.r}, ${triggerColor.g}, ${triggerColor.b})`}
  );
  padding-left: ${({ theme }) => theme.spacing(1)};
`;

const Label = styled(Typography)<{
  required?: boolean;
}>`
  font-weight: bold;
  margin-bottom: 4px;
  ::after {
    content: ${({ required }) => (required ? "'*'" : "")};
    color: ${({ theme }) => theme.palette.secondary.main};
  }
`;

const StyledCardContent = styled(CardContent)`
  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
  & > ${NameAndCategory} {
    margin-bottom: 0px;
  }
`;

const StateWrapper = styled("div")`
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const Buttons = styled("div")`
  display: flex;
  position: absolute;
  right: 8px;
  top: 8px;
`;

const CloseButton = styled(IconButton)``;

const DownButton = styled(IconButton)`
  margin-right: 16px;
`;

const UpButton = styled(IconButton)``;

const DuplicationButton = styled(IconButton)`
  margin-right: 16px;
`;

const FieldWrapper = styled("div")``;

type Props = {
  triggerIndex: number;
  trigger: Trigger;
  remove: () => void;
  isFirst: boolean;
  isLast: boolean;
  moveUp: () => void;
  moveDown: () => void;
  duplication: () => void;
};

const TriggerCard: React.FunctionComponent<Props> = ({
  triggerIndex,
  trigger,
  remove,
  isFirst,
  isLast,
  moveUp,
  moveDown,
  duplication,
}) => {
  return (
    <StyledCard triggerColor={trigger.color}>
      <Buttons>
        <DuplicationButton onClick={duplication}>
          <PostAddIcon />
        </DuplicationButton>
        <UpButton disabled={isFirst} onClick={moveUp}>
          <ArrowUpwardIcon />
        </UpButton>
        <DownButton disabled={isLast} onClick={moveDown}>
          <ArrowDownwardIcon />
        </DownButton>
        <CloseButton onClick={remove}>
          <CloseIcon />
        </CloseButton>
      </Buttons>
      <StyledCardContent>
        <NameAndCategory>
          <FieldWrapper>
            <Label required>displayName</Label>
            <Field name={`triggers.${triggerIndex}.displayName`}>
              {({ field }: FieldProps) => <TextField {...field} required />}
            </Field>
          </FieldWrapper>
          <FieldWrapper>
            <Label>category</Label>
            <Field name={`triggers.${triggerIndex}.category`}>
              {({ field }: FieldProps) => <TextField {...field} />}
            </Field>
          </FieldWrapper>
          <FieldWrapper>
            <Label>showConfirmDialog</Label>
            <Field name={`triggers.${triggerIndex}.showConfirmDialog`}>
              {({ field }: FieldProps) => (
                <FormControlLabel
                  control={
                    <Checkbox checked={Boolean(field.value)} {...field} />
                  }
                  label=""
                />
              )}
            </Field>
          </FieldWrapper>
        </NameAndCategory>
        <FieldWrapper>
          <Label>color</Label>
          <Field name={`triggers.${triggerIndex}.color`}>
            {({ field, form }: FieldProps) => (
              <StyledColorPicker
                triangle="hide"
                color={field.value}
                onChangeComplete={({ rgb }) => {
                  form.setFieldValue(field.name, rgb);
                }}
              />
            )}
          </Field>
        </FieldWrapper>
        <FieldWrapper>
          <Label required>state</Label>
          <FieldArray
            name={`triggers.${triggerIndex}.state`}
            render={(arrayHelpers) => {
              return (
                <StateWrapper>
                  {trigger.state.map((state, stateIndex) => (
                    <State
                      key={stateIndex}
                      triggerIndex={triggerIndex}
                      stateIndex={stateIndex}
                      state={state}
                      remove={() => {
                        arrayHelpers.remove(stateIndex);
                      }}
                      isFirst={stateIndex === 0}
                      isLast={stateIndex === trigger.state.length - 1}
                      moveUp={() => {
                        arrayHelpers.swap(stateIndex, stateIndex - 1);
                      }}
                      moveDown={() => {
                        arrayHelpers.swap(stateIndex, stateIndex + 1);
                      }}
                      duplication={() => {
                        arrayHelpers.insert(stateIndex + 1, {
                          ...state,
                          key: `${state.key}_copy`,
                        });
                      }}
                    />
                  ))}
                  <Button
                    startIcon={<AddCircleOutlineIcond />}
                    onClick={() => {
                      const emptyState: TriggerState = {
                        key: "",
                        type: "integer",
                        value: 0,
                      };
                      arrayHelpers.push(emptyState);
                    }}
                  >
                    Add
                  </Button>
                </StateWrapper>
              );
            }}
          />
        </FieldWrapper>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TriggerCard;
