import { useState, useEffect } from "react";
import axios from "../../API/axios";
import classes from "./OTP.module.css";
import { Button, Grid } from "@mui/material";

let time = 300;

function OTP(props) {
  const mobile = props.mob
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(time);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    document.getElementById(classes.wrong).style.display = "none";
  }, [otp]);

  function verifyFun(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("mobile", mobile);
    formData.append("otp", otp);

    axios({
      method: "post",
      url: "https://codegenium.com/WEBPANEL/MER_LOGIN/v1/verifyotp",
      data: formData,
      config: { headers: { "Content-Type": "multipart/form-data" } },
    })
      .then(function (response) {
        console.log(response);

        if (response.data.message !== "successfull") {
          document.getElementById(classes.wrong).innerHTML =
            response.data.message;
          document.getElementById(classes.wrong).style.display = "block";
        } else {
          props.verify();
        }
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }

  function resendOTP() {
    setCounter(time);
    const OTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    props.sendotp(mobile, OTP);

    let formData = new FormData();
    formData.append("mobile", mobile);
    formData.append("otp", OTP);

    axios({
      method: "post",
      url: "https://codegenium.com/WEBPANEL/MER_LOGIN/v1/updateotp",
      data: formData,
      config: { headers: { "Content-Type": "multipart/form-data" } },
    })
      .then(function (response) {
        console.log(response);
        if (response.data.message !== "OTP sent to your mobile number") {
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

  return (
    <Grid item xs={12} md={6} className={classes.grid}>
      <div className={classes.div}>
        <h1>OTP</h1>
      </div>
      <h4 id={classes.wrong}>Error Msg</h4>
      <form onSubmit={verifyFun}>
        <div>
          <label className={classes.label}>OTP:</label>
          <input
            type="number"
            className={classes.input}
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            required
          />
        </div>
        <p>OTP Entered - {otp}</p>
        <Button onClick={(e) => setOtp("")} className={classes.btn}>
          Clear
        </Button>
        {counter ? (
          <Button type="submit" className={classes.btnResend}>
            Verify OTP
          </Button>
        ) : (
          <Button
            id="resendBtn"
            onClick={resendOTP}
            className={classes.btnResend}
          >
            Resend OTP
          </Button>
        )}
        {counter ? (
          <p>
            Time :{" "}
            {parseInt(counter / 60)
              ? parseInt(counter / 60) + " min " + (counter % 60)
              : counter % 60}{" "}
            sec
          </p>
        ) : (
          <p style={{ display: "none" }} />
        )}
      </form>
    </Grid>
  );
}

export default OTP;
