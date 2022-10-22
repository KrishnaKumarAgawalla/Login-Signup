import { useState } from "react";
import axios from "../../API/axios";
import classes from "./Login.module.css";
import { Button, Grid, Checkbox, FormControlLabel, Card } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [id, setID] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.getElementById(classes.wrong).style.display = "none";
  }, [mobile, password]);

  function handleForgot(e) {
    e.preventDefault();
    navigate("/forgot_password");
  }

  function handleLogin(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("mobile", mobile);
    formData.append("password", password);

    axios({
      method: "post",
      url: "https://codegenium.com/WEBPANEL/MER_LOGIN/v1/userLogin",
      data: formData,
      config: { headers: { "Content-Type": "multipart/form-data" } },
    })
      .then(function (response) {
        console.log(response);
        if (response.data.error !== true) {
          localStorage.setItem("remember", remember);
          localStorage.setItem("user_id", response.data.id);
          localStorage.setItem("mobile", response.data.mobile);
          localStorage.setItem("name", response.data.username);
          localStorage.setItem("company", response.data.cmpny);
          localStorage.setItem("img", response.data.sts);
          setID(response.data.id);
          window.location.replace("/dashboard");
        } else {
          console.log(response.data.message);
          document.getElementById(classes.wrong).innerHTML =
            response.data.message;
          document.getElementById(classes.wrong).style.display = "block";
        }
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }

  const handleNav = () => {
    if (location.state) {
      if (location.state.prevPath === "/register") {
        navigate(-1);
      } else {
        navigate("/register", {
          state: { ...location.state, prevPath: location.pathname },
        });
      }
    } else {
      navigate("/register", {
        state: { ...location.state, prevPath: location.pathname },
      });
    }
  };

  useEffect(() => {
    if (id !== "") {
      console.log(localStorage.getItem("user_id"));
    }
  }, [id]);

  return (
    <>
      <Card className={classes.card}>
        <h1 className={classes.head}>Login</h1>
        <h4 id={classes.wrong}>Error Msg</h4>
        <form onSubmit={handleLogin}>
          <div>
            <label className={classes.label}>Mobile Number:</label>
            <input
              type="tel"
              pattern="[6-9]{1}[0-9]{9}"
              className={classes.input}
              placeholder="Mobile"
              onChange={(e) => setMobile(e.target.value)}
              value={mobile}
              required
            />
          </div>
          <div>
            <label className={classes.label}>Password:</label>
            <input
              type="password"
              className={classes.input}
              placeholder="Password*"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox onChange={() => setRemember(!remember)} />}
                  label="Remember Me"
                />
              </Grid>
              <Grid item xs={6} className={classes.forgot}>
                <FormControlLabel
                  control={<Button sx={{ display: "none" }} />}
                  label="Forgot Password"
                  className={classes.forgotBtn}
                  onClick={handleForgot}
                />
              </Grid>
            </Grid>
            <div style={{marginBottom: "0.5rem"}}>
              <span onClick={handleNav} className={classes.registerbtn}>
                Don't have an account? Register.
              </span>
            </div>
          </div>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </form>
      </Card>
    </>
  );
}

export default Login;
