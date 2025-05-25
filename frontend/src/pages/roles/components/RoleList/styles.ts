import { styled } from "@mui/material/styles";
import { Paper, TableContainer } from "@mui/material";

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxHeight: "calc(100vh - 250px)",
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));
