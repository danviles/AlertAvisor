import { useState } from "react";
import PropTypes from "prop-types";
import logo1 from "@/images/logo1.png";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import Swal from "sweetalert2";

const LoginComponent = ({ setEmail }) => {
  const [email_input, setEmailInput] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const email_regex = /\S+@\S+\.\S+/;
    if (!email_regex.test(email_input)) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Correo electronico invalido",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    setEmail(email_input);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 max-w-[500px] p-4">
      <div className="w-72">
        <img src={logo1} alt="logo" />
      </div>
      <div className="">
        <h2 className="text-white font-bold text-left text-xl">
          A continuacon introduce el correo electronico al que llegaran las
          alertas del sistema.
        </h2>
      </div>
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <TextField
          type="email"
          placeholder="Email"
          value={email_input}
          onChange={(e) => setEmailInput(e.target.value)}
          variant="outlined"
          InputProps={{
            sx: { bgcolor: "white", borderRadius: "4px", border: "0px" },
            endAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="success"
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleLogin}
        >
          Entrar al sistema
        </Button>
      </form>
    </div>
  );
};

LoginComponent.propTypes = {
  setEmail: PropTypes.func,
};

export default LoginComponent;
