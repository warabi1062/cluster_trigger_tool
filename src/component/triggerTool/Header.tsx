import React from "react";

import { Typography, AppBar, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

const Title = styled(Typography)`
  flex-grow: 1;
`;

const Header: React.FunctionComponent = () => {
  return (
    <AppBar>
      <Toolbar>
        <Title variant="h6">Cluster Trigger Tool</Title>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
