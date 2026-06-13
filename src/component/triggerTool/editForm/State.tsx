import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Field, FieldProps } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PostAddIcon from "@mui/icons-material/PostAdd";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { TriggerState } from "../../../types/Trigger";
import { styled } from "@mui/material/styles";

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

const Buttons = styled("div")`
  position: absolute;
  right: 8px;
  top: 8px;
  display: flex;
`;

const ButtonBase = styled(IconButton)``;

const CloseButton = styled(ButtonBase)``;

const DownButton = styled(ButtonBase)`
  margin-right: 16px;
`;

const UpButton = styled(ButtonBase)``;

const DuplicationButton = styled(ButtonBase)`
  margin-right: 16px;
`;

const Container = styled(Paper)`
  position: relative;
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 8px;
    &:not(:last-child) {
      margin-right: 16px;
    }
  }
  & > ${CloseButton} {
    margin: 0;
  }
`;

const StyledSelect = styled(Select)`
  width: 120px;
`;

const FieldWrapper = styled("div")``;

const ValueTextField = styled(TextField)`
  width: 120px;
`;

const ValueFormControlLabel = styled(FormControlLabel)`
  width: 120px;
`;

type Props = {
  triggerIndex: number;
  stateIndex: number;
  state: TriggerState;
  remove: () => void;
  isFirst: boolean;
  isLast: boolean;
  moveUp: () => void;
  moveDown: () => void;
  duplication: () => void;
};

const State: React.FunctionComponent<Props> = ({
  triggerIndex,
  stateIndex,
  state,
  remove,
  isFirst,
  isLast,
  moveUp,
  moveDown,
  duplication,
}) => {
  return (
    <Container>
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
      <FieldWrapper>
        <Label required>key</Label>
        <Field name={`triggers.${triggerIndex}.state.${stateIndex}.key`}>
          {({ field }: FieldProps) => <TextField {...field} required />}
        </Field>
      </FieldWrapper>
      <FieldWrapper>
        <Label required>type</Label>
        <Field name={`triggers.${triggerIndex}.state.${stateIndex}.type`}>
          {({ field, form }: FieldProps) => (
            <StyledSelect
              {...field}
              onChange={({ target }) => {
                switch (target.value) {
                  case "bool": {
                    form.setFieldValue(
                      `triggers.${triggerIndex}.state.${stateIndex}.type`,
                      target.value,
                    );

                    form.setFieldValue(
                      `triggers.${triggerIndex}.state.${stateIndex}.value`,
                      false,
                    );
                    break;
                  }
                  case "float":
                  case "integer": {
                    form.setFieldValue(
                      `triggers.${triggerIndex}.state.${stateIndex}.type`,
                      target.value,
                    );

                    form.setFieldValue(
                      `triggers.${triggerIndex}.state.${stateIndex}.value`,
                      0,
                    );
                    break;
                  }
                  case "signal": {
                    form.setFieldValue(
                      `triggers.${triggerIndex}.state.${stateIndex}.type`,
                      target.value,
                    );
                    form.setFieldValue(
                      `triggers.${triggerIndex}.state.${stateIndex}.value`,
                      undefined,
                    );
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }}
            >
              <MenuItem value="bool">boolean</MenuItem>
              <MenuItem value="integer">integer</MenuItem>
              <MenuItem value="float">float</MenuItem>
              <MenuItem value="signal">signal</MenuItem>
            </StyledSelect>
          )}
        </Field>
      </FieldWrapper>
      {(state.type === "integer" || state.type === "float") && (
        <FieldWrapper>
          <Label required>value</Label>
          <Field name={`triggers.${triggerIndex}.state.${stateIndex}.value`}>
            {({ field }: FieldProps) => (
              <ValueTextField {...field} type="number" required />
            )}
          </Field>
        </FieldWrapper>
      )}
      {state.type === "bool" && (
        <FieldWrapper>
          <Label>value</Label>
          <Field name={`triggers.${triggerIndex}.state.${stateIndex}.value`}>
            {({ field }: FieldProps) => (
              <ValueFormControlLabel
                control={<Checkbox checked={Boolean(field.value)} {...field} />}
                label="true"
              />
            )}
          </Field>
        </FieldWrapper>
      )}
    </Container>
  );
};

export default State;
