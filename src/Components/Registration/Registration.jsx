import { useState, useEffect } from "react";
import axios from "../../API/axios";
import classes from "./Registration.module.css";
import { Button, FormControlLabel, Checkbox, Link, Card } from "@mui/material";
import OTP from "../OTP/OTP";
import { useLocation, useNavigate } from "react-router-dom";

function Registration(props) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.getElementById(classes.wrong).style.display = "none";
  }, [confirm, password, mobile]);

  const handleNav = () => {
    if (location.state) {
      if (location.state.prevPath === "/login") {
        navigate(-1);
      } else {
        navigate("/login", {
          state: { ...location.state, prevPath: location.pathname },
        });
      }
    } else {
      navigate("/login", {
        state: { ...location.state, prevPath: location.pathname },
      });
    }
  };

  const sendOTP = async (mob, Otp) => {
    try {
      const response = await axios.post(
        "https://apps.sandeshlive.com/API/WebSMS/Http/v1.0a/index.php?userid=1638&password=6l1JW7vfKdciZb9D&sender=CODEGM&to=" +
          mob +
          "&message=Hi! Your OTP for registration is: " +
          Otp +
          ". This OTP is valid for 5 minutes. Please do not share it with anyone. - CodeGenium&reqid=1&format=json&route_id=3&unique",
        JSON.stringify({}),
        {
          headers: { "Content-Type": "multipart/form-data" },
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

  function handleRegistration(e) {
    e.preventDefault();
    if (password === confirm) {
      const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

      let formData = new FormData();

      formData.append("username", name);
      formData.append("cmpny", company);
      formData.append("mobile", mobile);
      formData.append("password", password);
      formData.append("otp", otp);

      axios({
        method: "post",
        url: "https://codegenium.com/WEBPANEL/MER_LOGIN/v1/registerUser",
        data: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      })
        .then(function (response) {
          console.log(response);
          if (response.data.error !== true) {
            sendOTP(mobile, otp);
            props.register(name, company, mobile, password, otp);
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
    } else {
      document.getElementById(classes.wrong).innerHTML =
        "Confirm Password should match with Password";
      document.getElementById(classes.wrong).style.display = "block";
    }
  }
  return (
    <>
      {showOTP ? (
        <OTP
          mob={mobile}
          verify={() => {
            setShowOTP(false);
            setSuccess(true);
          }}
          sendOTP={sendOTP}
        />
      ) : (
        <Card className={classes.card}>
          {success && (
            <h4 style={{ color: "green" }}>Registration Successful!</h4>
          )}
          <h1 className={classes.head}>Register Yourself</h1>
          <h4 id={classes.wrong}>Error Msg</h4>
          <form onSubmit={handleRegistration}>
            <div>
              <label className={classes.label}>Name:</label>
              <input
                className={classes.input}
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div>
              <label className={classes.label}>Company:</label>
              <input
                className={classes.input}
                type="text"
                placeholder="Company Name"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
                required
              />
            </div>
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
                className={classes.input}
                type="password"
                placeholder="Password*"
                minLength="8"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={classes.label}>Confirm Password:</label>
              <input
                className={classes.input}
                type="Password"
                placeholder="Confirm Password*"
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <FormControlLabel
              control={<Checkbox required />}
              label={<Link className={classes.link}>Privacy Policy</Link>}
              className={classes.privacy}
            />

            <span
              onClick={handleNav}
              className={classes.loginbtn}
            >
              Have an account? Login.
            </span>
            <Button type="submit" className={classes.btn}>
              Register Now
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}

export default Registration;
