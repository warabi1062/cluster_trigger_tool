import { Container } from "@mui/material";
import { styled } from "@mui/system";
import EditForm from "./editForm";
import Footer from "./Footer";
import Header from "./Header";
import { FC } from "react";

const Wrapper = styled("div")`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TriggerTool: FC = () => {
  return (
    <Wrapper>
      <Header />
      <Container>
        <EditForm />
      </Container>
      <Footer />
    </Wrapper>
  );
};

export default TriggerTool;
