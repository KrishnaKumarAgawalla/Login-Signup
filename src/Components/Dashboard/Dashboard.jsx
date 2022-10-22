import { Grid, Card, useTheme, useMediaQuery } from "@mui/material";
import DrawerComp from "../UI/Drawer/DrawerComp";

function Dashboard(props) {
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Grid container spacing={2} style={{ height: "100%" }}>
        {!isMatch && (
          <Grid item md={2.5} xs={5}>
            <DrawerComp lists={props.lists} />
          </Grid>
        )}
        <Grid
          item
          md={9.5}
          xs={12}
          style={{ backgroundColor: "rgb(247, 248, 252)", height: "100%" }}
        >
          {isMatch && <DrawerComp lists={props.lists} cred={props.cred} />}
          <Card>
            <h1>Dashboard</h1>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
