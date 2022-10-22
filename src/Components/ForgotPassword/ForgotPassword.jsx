import { useState, useEffect } from "react";
import axios from "../../API/axios";
import classes from "./ForgotPassword.module.css";
import { Button, Card } from "@mui/material";
import OTP from "../OTP/OTP";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [mobile, setMobile] = useState("");
  const [pass, setPass] = useState("");
  const [passConf, setPassConf] = useState("");
  const [otp, setOTP] = useState(
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  );
  const [showOTP, setShowOTP] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById(classes.wrong).style.display = "none";
  }, [mobile, pass, passConf]);

  const sendOTP = async (mob, Otp) => {
    try {
      const response = await axios.post(
        "https://apps.sandeshlive.com/API/WebSMS/Http/v1.0a/index.php?userid=1638&password=6l1JW7vfKdciZb9D&sender=CODEGM&to=" +
          mob +
          "&message=Hi! Your OTP for Blood Tap registration is: " +
          Otp +
          ". This OTP is valid for 5 minutes. Please do not share it with anyone. - CodeGenium&reqid=1&format=json&route_id=3&unique",
        JSON.stringify({}),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err) {
      if (!err?.response) {
        setErrMsg("There is some issue with the server");
        console.log(errMsg + " Catch IF");
      } else {
        setErrMsg(err.response?.message);
        console.log(errMsg + " Catch ELSE");
      }
    }
  };

  function handleReset(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("mobile", mobile);

    if (!showPass) {
      formData.append("otp", otp);

      axios({
        method: "post",
        url: "https://codegenium.com/WEBPANEL/MER_LOGIN/v1/forgot_mobile",
        data: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      })
        .then(function (response) {
          console.log(response);
          if (response.data.error !== true) {
            sendOTP(mobile, otp);
            setShowOTP(true);
            setShowPass(true);
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
    } else {
      if (pass !== passConf) {
        document.getElementById(classes.wrong).innerHTML =
          "Confirm Password should match with Password";
        document.getElementById(classes.wrong).style.display = "block";
      } else {
        formData.append("password", pass);
        axios({
          method: "post",
          url: "https://codegenium.com/WEBPANEL/MER_LOGIN/v1/forgot_password",
          data: formData,
          config: { headers: { "Content-Type": "multipart/form-data" } },
        })
          .then(function (response) {
            console.log(response);
            if (response.data.message === "Password changed successfully!") {
              navigate(-1);
            } else {
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
    }
  }

  return (
    <>
      {showOTP ? (
        <OTP
          mob={mobile}
          verify={() => setShowOTP(false)}
          otp={otp}
          sendOTP={sendOTP}
        />
      ) : (
        <Card className={classes.card}>
          <h1 className={classes.head}>Forgot Password</h1>
          <h4 id={classes.wrong}>Error Msg</h4>
          <form onSubmit={handleReset}>
            <div style={showPass ? { display: "none" } : { display: "block" }}>
              <label className={classes.label}>Mobile Number:</label>
              <input
                type="tel"
                pattern="[6-9]{1}[0-9]{9}"
                className={classes.input}
                placeholder="Mobile"
                onChange={(e) => setMobile(e.target.value)}
                value={mobile}
                required={!showPass}
              />
            </div>
            <div style={showPass ? { display: "block" } : { display: "none" }}>
              <div>
                <label className={classes.label}>New Password:</label>
                <input
                  type="password"
                  minLength="8"
                  className={classes.input}
                  placeholder="New Password"
                  onChange={(e) => setPass(e.target.value)}
                  value={pass}
                  required={showPass}
                />
              </div>
              <div></div>
              <label className={classes.label}>Confirm Password:</label>
              <input
                className={classes.input}
                type="Password"
                placeholder="Confirm Password*"
                onChange={(e) => setPassConf(e.target.value)}
                required={showPass}
              />
            </div>
            <Button type="submit" className={classes.btn}>
              Send
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}

export default ForgotPassword;
