import { useState } from "react";
import classes from "./DrawerComp.module.css";
import {
  Drawer,
  ListItem,
  ListItemButton,
  Avatar,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import DashboardTwoToneIcon from "@mui/icons-material/DashboardTwoTone";
import BusinessCenterTwoToneIcon from "@mui/icons-material/BusinessCenterTwoTone";
import CampaignTwoToneIcon from "@mui/icons-material/CampaignTwoTone";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyIcon from "@mui/icons-material/Key";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useNavigate, useLocation } from "react-router-dom";

const icons = [
  <DashboardTwoToneIcon />,
  <BusinessCenterTwoToneIcon />,
  <CampaignTwoToneIcon />,
  <KeyIcon />,
];

const route = ["profile", "dashboard", "job", "applicant", "changepassword"];

function DrawerComp(props) {
  let status = "";
  const userCred = {
    id: localStorage.getItem("user_id"),
    name: localStorage.getItem("name"),
    mobile: localStorage.getItem("mobile"),
    company: localStorage.getItem("company"),
    img: localStorage.getItem("img"),
  };

  if (userCred.img === "PENDING") {
    status = "On Hold";
  } else if (userCred.img === "DEACTIVE") {
    status = "Blocked";
  } else {
    status = "Accepted";
  }

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState();

  let navigate = useNavigate();
  let location = useLocation();

  function handleChange() {
    localStorage.setItem("remember", false);
    localStorage.setItem("user_id", "");
    localStorage.setItem("mobile", "");
    localStorage.setItem("name", "");
    localStorage.setItem("company", "");
    localStorage.setItem("img", "");
    localStorage.setItem("email", "");
    localStorage.setItem("gst", "");
    localStorage.setItem("address", "");
    window.location.replace("/login");
    window.location.reload(false);
  }

  function handleLink(val) {
    if (location.state) {
      location.state.prevPathArr.map(
        (data, index) => data === "/" + route[val] && navigate(-(index + 1))
      );

      navigate("/" + route[val], {
        state: {
          ...location.state,
          prevPathArr: location.state.prevPathArr.push(location.pathname),
        },
      });
    } else {
      navigate("/" + route[val], {
        state: { ...location.state, prevPathArr: [location.pathname] },
      });
    }
  }

  return (
    <>
      <Drawer
        variant={isMatch ? "" : "permanent"}
        open={isMatch && open}
        onClose={isMatch && (() => setOpen(false))}
        classes={{ paper: classes.paper }}
      >
        <ListItem className={classes.avatarList}>
          <div className={classes.nameDiv}>
            <h3 style={{ textTransform: "uppercase" }}>{userCred.company}</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <p> {"Status: " + status}</p>
              </Grid>
              <Grid item xs={6}>
                <Avatar variant="rounded" className={classes.avatar} />
              </Grid>
            </Grid>

            <Button variant="contained" onClick={() => handleLink(0)}>
              View Profile
            </Button>
          </div>
        </ListItem>

        {props.lists.map((list, index) => (
          <ListItem
            key={index}
            onClick={() => handleLink(index + 1)}
            disablePadding
            sx={{ color: "black" }}
          >
            <ListItemButton>
              <p style={{ margin: 0, marginRight: "1rem" }}>{icons[index]}</p>
              {list}
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem
          onClick={() => handleChange()}
          disablePadding
          sx={{ color: "black" }}
        >
          <ListItemButton onClick={() => handleChange()}>
            <p style={{ margin: 0, marginRight: "1rem" }}>
              <LogoutRoundedIcon />
            </p>
            Logout
          </ListItemButton>
        </ListItem>
      </Drawer>
      {isMatch && (
        <IconButton className={classes.btn} onClick={() => setOpen(!open)}>
          <MenuRoundedIcon />
        </IconButton>
      )}
    </>
  );
}

export default DrawerComp;
