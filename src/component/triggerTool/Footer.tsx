import React from "react";

import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton, styled } from "@mui/material";

const Container = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;

const Footer: React.FunctionComponent = () => {
  return (
    <Container>
      <IconButton
        href="https://github.com/warabi1062/cluster_trigger_tool"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon />
      </IconButton>
    </Container>
  );
};

export default Footer;
