import { Box } from "@material-ui/core";
import VerticalLinearStepper from "../components/steps";

function index() {
  return (
    <Box
      sx={{
        maxWidth: 250,
        m: "auto",
      }}
    >
      <h3>My startup progress</h3>
      {process.browser ? <VerticalLinearStepper /> : <div>loading...</div>}
    </Box>
  );
}

export default index;
