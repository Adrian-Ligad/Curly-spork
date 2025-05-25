import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";

export const FormContainer = styled(Stack)(({ theme }) => ({
  maxWidth: 500,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));
