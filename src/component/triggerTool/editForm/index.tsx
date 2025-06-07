import { FC, useState } from "react";
import { Formik, FieldArray, Form } from "formik";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  triggersToTriggerJsonText,
  triggerJsonTextToTriggers,
} from "../../../encoder/json";
import { download } from "../../../utils/download";
import { styled } from "@mui/system";
import { JsonFormat, Trigger } from "../../../types/Trigger";
import TriggerCard from "./TriggerCard";
import { sendTrackingEvent } from "../../../utils/analytics";

const CardWrapper = styled("div")`
  margin-bottom: 16px;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const ButtonsArea = styled("div")`
  margin-bottom: 16px;
  > *:not(:last-child) {
    margin-right: 16px;
  }
`;

const EditForm: FC = () => {
  const [initialValues, setInitialValues] = useState<{ triggers: Trigger[] }>({
    triggers: [
      {
        displayName: "",
        category: "",
        showConfirmDialog: false,
        color: { r: 256, g: 256, b: 256 },
        state: [
          {
            key: "",
            type: "integer",
            value: 0,
          },
        ],
      },
    ],
  });
  const loadJsonFile = () => {
    const fr = new FileReader();
    fr.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        const parsed: JsonFormat = JSON.parse(e.target.result);
        const triggers = triggerJsonTextToTriggers(parsed);
        setInitialValues({ triggers });
      }
    };
    const inputElement = document.createElement("input");
    document.body.appendChild(inputElement);
    inputElement.type = "file";
    inputElement.accept = "application/json";
    inputElement.style = "display: none;";
    inputElement.onchange = (e) => {
      // @ts-expect-error めんどい
      const file = e.target?.files[0] as File | undefined;
      if (file) {
        fr.readAsText(file);
      }
      inputElement.remove();
    };
    inputElement.click();
  };
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(v) => {
        const triggerJsonText = triggersToTriggerJsonText(v.triggers);
        download(triggerJsonText, "trigger.json", "application/json");
      }}
    >
      {({ values }) => (
        <Form>
          <ButtonsArea>
            <Button
              type="submit"
              color="primary"
              onClick={() => {
                sendTrackingEvent("export");
              }}
            >
              Export JSON
            </Button>
            <Button
              onClick={() => {
                loadJsonFile();
                sendTrackingEvent("import");
              }}
            >
              Import JSON
            </Button>
          </ButtonsArea>
          <FieldArray
            name="triggers"
            render={(arrayHelpers) => {
              return (
                <>
                  <CardWrapper>
                    {values.triggers.map((trigger, triggerIndex) => (
                      <TriggerCard
                        key={triggerIndex}
                        triggerIndex={triggerIndex}
                        trigger={trigger}
                        remove={() => {
                          arrayHelpers.remove(triggerIndex);
                          sendTrackingEvent("remove trigger");
                        }}
                        isFirst={triggerIndex === 0}
                        isLast={triggerIndex === values.triggers.length - 1}
                        moveUp={() => {
                          arrayHelpers.swap(triggerIndex, triggerIndex - 1);
                          sendTrackingEvent("move up trigger");
                        }}
                        moveDown={() => {
                          arrayHelpers.swap(triggerIndex, triggerIndex + 1);
                          sendTrackingEvent("move down trigger");
                        }}
                        duplication={() => {
                          arrayHelpers.insert(triggerIndex + 1, {
                            ...trigger,
                            displayName: `${trigger.displayName}_copy`,
                          });
                        }}
                      />
                    ))}
                  </CardWrapper>
                  <Button
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => {
                      const emptyTrigger: Trigger = {
                        displayName: "",
                        category: "",
                        showConfirmDialog: false,
                        color: { r: 256, g: 256, b: 256 },
                        state: [],
                      };
                      arrayHelpers.push(emptyTrigger);
                      sendTrackingEvent("add trigger");
                    }}
                  >
                    Add
                  </Button>
                </>
              );
            }}
          />
        </Form>
      )}
    </Formik>
  );
};

export default EditForm;
