import logo1 from "@/images/logo1.png";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import PaidIcon from "@mui/icons-material/Paid";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useState } from "react";
import TransactionList from "./transactions";

const ManagerComponent = () => {
  const [mountAlertValue, setMountAlertValue] = useState(400);
  const [transactions, setTransactions] = useState({});

  return (
    <>
      {/* HEADER LOGO */}
      <div className="w-72">
        <img src={logo1} alt="logo" />
      </div>
      {/* MANAGER */}
      <div className="flex w-full h-full bg-white">
        {/* PANEL DE CONTROL */}
        <div className="flex w-2/12 border p-5">
          {/* INPUTS DE CONFIGURACION DE ALERTA */}
          <div className="">
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
                <Button>Agregar</Button>
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
        <div className="flex flex-col p-5 w-full">
          {/* SIMULACION DE TRANSACCIONES */}
          <div className="border rounded-lg p-5">
            <h2>Simulación de movimientos</h2>
            <div className="flex mt-5 justify-between gap-5">
              <div className="w-6/12">
                <FormControl variant="standard" className="w-full">
                  <FormHelperText id="standard-weight-helper-text">
                    Numero de cuenta del destinatario
                  </FormHelperText>
                  <TextField
                    type="text"
                    placeholder="Numero de cuenta"
                    variant="outlined"
                    size="small"
                  />
                </FormControl>
                <div className="flex justify-between items-center gap-2">
                  <FormControl variant="standard" className="w-full">
                    <FormHelperText id="standard-weight-helper-text">
                      Nombre del propietario
                    </FormHelperText>
                    <TextField
                      type="text"
                      placeholder="Nombre"
                      variant="outlined"
                      size="small"
                    />
                  </FormControl>
                  <FormControl variant="standard" className="w-full">
                    <FormHelperText id="standard-weight-helper-text">
                      Cedula
                    </FormHelperText>
                    <TextField
                      type="text"
                      placeholder="Cedula"
                      variant="outlined"
                      size="small"
                    />
                  </FormControl>
                  <FormControl variant="outlined" className="w-full">
                    <FormHelperText sx={{ m: "0px" }}>
                      Tipo de cuenta
                    </FormHelperText>

                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                      size="small"
                    >
                      <MenuItem value={"natural"}>Natural</MenuItem>
                      <MenuItem value={"empreza"}>Empresa</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="flex justify-between items-end">
                  <FormControl variant="standard" className="w-[250px]">
                    <FormHelperText id="standard-weight-helper-text">
                      Monto
                    </FormHelperText>
                    <TextField
                      type="text"
                      placeholder="Monto"
                      variant="outlined"
                      size="small"
                    />
                  </FormControl>
                  <Button>Crear transferencia</Button>
                </div>
              </div>
              <div className="flex flex-col justify-between items-center w-6/12 border rounded-lg p-5">
                <p>
                  {
                    "El siguiente boton crea una transferencia con datos ficticios a modo de simular a bajo nivel un trafico de transacciones, el sistema generara una alerta automaticamente una vez se detecte cualquier transaccione que cumpla con las condiciones del panel de configuracion"
                  }
                </p>
                <Button>Crear transferencia</Button>
              </div>
            </div>
          </div>
          {/* LOGS DE TRANSFERENCIAS */}
          <div className="border rounded-lg p-5 mt-5 h-[200px] overflow-auto">
            <h2>Transaciones en tiempo real</h2>
            <TransactionList transactions={transactions} />
          </div>
          {/* LOGS DE ALERTAS */}
          <div className="border rounded-lg p-5 mt-5 h-[200px] overflow-auto">
            <h2>Alertas creadas</h2>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerComponent;

// Inputs necesarios
// Numero de cuenta
// Nombre de propietario de la cuenta
// Monto
// Nombre de quien envia
// Cedula de quien envia
// Tipo de persona (natural/empresa)
// Numero de referencia - SE GENERA AUTOMATICAMENTE
// Fecha y hora - SE GENERA AUTOMATICAMENTE
