import logo1 from "@/images/logo1.png";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import PaidIcon from "@mui/icons-material/Paid";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button";
import { useState } from "react";

const ManagerComponent = () => {
  const [mountAlertValue, setMountAlertValue] = useState(400);

  return (
    <>
      {/* HEADER LOGO */}
      <div className="w-72">
        <img src={logo1} alt="logo" />
      </div>
      {/* MANAGER */}
      <div className="flex flex-col h-full">
        {/* PANEL DE CONTROL */}
        <div className="flex bg-white">
          {/* INPUTS DE CONFIGURACION DE ALERTA */}
          <div className="border p-5 w-2/12">
            <h2>Configuración de alertas</h2>
            <div className="flex-col">
              {/* INPUTS ALERTAS */}
              <div className="flex gap-2 flex-wrap">
                <FormControl variant="standard" className="w-full">
                  <FormHelperText id="standard-weight-helper-text">
                    Alertar con montos mayores a
                  </FormHelperText>
                  <TextField
                    type="number"
                    placeholder="500"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <PaidIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText id="standard-weight-helper-text">
                    Para personas naturales.
                  </FormHelperText>
                </FormControl>
                <FormControl variant="standard" className="w-full">
                  <FormHelperText id="standard-weight-helper-text">
                    Alertar al detectar
                  </FormHelperText>
                  <TextField
                    type="number"
                    placeholder="20"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          Operaciones
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText id="standard-weight-helper-text">
                    De la misma cuenta al dia.
                  </FormHelperText>
                </FormControl>
              </div>
              {/* LISTA NEGRA */}
              <div>
                <h2 className="mb-2">Lista negra</h2>
                <div className="border p-2 flex rounded-md mb-2">
                  <p>
                    {
                      "A continuación se muestra un panel de administración que permite agregar o eliminar cuentas de la lista negra."
                    }
                  </p>
                  <ErrorIcon className="text-amber-400" />
                </div>
                <div className="">
                  <FormControl variant="standard" className="w-full">
                    <TextField
                      type="text"
                      placeholder="Numero de cuenta"
                      variant="outlined"
                      size="small"
                    />
                  </FormControl>
                  <Button >
                    Agregar
                  </Button>
                </div>
                <div className="flex flex-col mt-4 border rounded-md p-2 max-h-44 overflow-auto">
                  <div className="flex justify-between">
                    <p>1234567890</p>
                    <Button>X</Button>
                  </div>
                  <div className="flex justify-between">
                    <p>1234567890</p>
                    <Button>X</Button>
                  </div>
                  <div className="flex justify-between">
                    <p>1234567890</p>
                    <Button>X</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* LOGS DE TRANSFERENCIAS */}
        <div></div>
        {/* LOGS DE ALERTAS */}
        <div></div>
      </div>
    </>
  );
};

export default ManagerComponent;
