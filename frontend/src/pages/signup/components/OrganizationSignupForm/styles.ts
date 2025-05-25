import { styled } from "@mui/material/styles";
import { Stack, Paper } from "@mui/material";

export const FormContainer = styled(Stack)(({ theme }) => ({
  maxWidth: 600,
  margin: "0 auto",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));
