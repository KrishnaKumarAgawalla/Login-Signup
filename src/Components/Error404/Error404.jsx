import classes from "./Error404.module.css";

function Error404() {
  return (
    <div className={classes.div}>
        <h1 className={classes.errorHead} >Error 404</h1>
      <h3 className={classes.head}>Oh Snap! Lost Posting Job</h3>
      <h5
        onClick={() => window.location.replace("/login")}
        className={classes.link}
      >
        Go To Login
      </h5>
    </div>
  );
}

export default Error404;
