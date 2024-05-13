import logo1 from "@/images/logo1.png";
import PropTypes from "prop-types";
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
import { genId } from "../../helpers/genId";
import { format } from "date-fns";

const ManagerComponent = ({ email }) => {
  const [mountAlertValue, setMountAlertValue] = useState(400);
  const [accountCountAlertValue, setAccountCountAlertValue] = useState(20);
  const [blackListValue, setBlackListValue] = useState("");

  const [cuenta, setCuenta] = useState("");
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [tipo, setTipo] = useState("");
  const [monto, setMonto] = useState(0);

  const [blackList, setBlackList] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [alerts, setAlerts] = useState([]);

  const formatDate = (date) => {
    const formattedDate = format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
    return formattedDate;
  }

  const sendEmail = (transactionData, tipo) => {

    setAlerts([
      {
        id: transactionData.id,
        log: `${formatDate(new Date())} Correo enviado a ${email} por transaccion: Ref: ${transactionData.id} - Cuenta: ${transactionData.cuenta} - Nombre: ${transactionData.nombre} - Monto: ${transactionData.monto} - Tipo de alerta: ${tipo}`,
      },
      ...alerts,
    ]);
  };

  const addBlackList = (account) => {
    if (blackList.includes(account) || account === "") {
      setBlackListValue("");
      return;
    }
    setBlackList([...blackList, account]);
    setBlackListValue("");
  };

  const handleMontoChange = (e) => {
    let inputMonto = e.target.value;

    // Remover caracteres no numéricos excepto el punto decimal
    inputMonto = inputMonto.replace(/[^0-9.]/g, "");

    // Verificar si el número tiene más de dos decimales
    const decimalCount = inputMonto.split(".")[1]
      ? inputMonto.split(".")[1].length
      : 0;

    if (decimalCount > 2) {
      // Si tiene más de dos decimales, truncar el exceso
      inputMonto = parseFloat(inputMonto).toFixed(2);
    }

    // Verificar si el número es negativo
    if (parseFloat(inputMonto) < 0) {
      // Si es negativo, establecerlo como 0
      inputMonto = "0.00";
    }

    // Actualizar el estado monto
    setMonto(inputMonto);
  };

  const handleTransaction = (cuenta, nombre, cedula, monto, tipo) => {
    if ([cuenta, nombre, cedula, monto, tipo].some((value) => value === "")) {
      return;
    }

    const newTransaction = {
      id: genId(),
      dateTime: new Date().toISOString(),
      cuenta,
      nombre,
      cedula,
      monto,
      tipo,
    };

    if (!transactions[cuenta]) {
      transactions[cuenta] = {
        transacciones: [{ ...newTransaction }],
        count: 1,
      };
    } else {
      transactions[cuenta].transacciones.push({ ...newTransaction });
      transactions[cuenta].count++;
    }

    if (!blackList.includes(cuenta)) {
      if (parseFloat(monto) > mountAlertValue && tipo === "natural") {
        sendEmail({ ...newTransaction }, "Superó limite de monto");
      }
      if (transactions[cuenta].count > accountCountAlertValue) {
        transactions[cuenta].count = 0;
        sendEmail(
          { ...newTransaction },
          "Superó limite diario de transacciones"
        );
      }
    } else {
      sendEmail({ ...newTransaction }, "Pertenece a lista negra");
    }

    setTransactions({ ...transactions });
    setCuenta("");
    setNombre("");
    setCedula("");
    setTipo("");
    setMonto(0);
  };

  const genRnadomNombre = () => {
    const nombres = [
      "Juan",
      "Pedro",
      "Maria",
      "Jose",
      "Luis",
      "Ana",
      "Carlos",
      "Rosa",
      "Luisa",
      "Jorge",
      "Fernando",
      "Carmen",
      "Sofia",
      "Andres",
      "Miguel",
      "Antonio",
      "Laura",
      "Diana",
      "Dario",
      "Camilo",
    ];
    return nombres[Math.floor(Math.random() * nombres.length)];
  }

  const genRandomTransaction = () => {
    const nombre = genRnadomNombre();
    const cedula = Math.floor(Math.random() * (25000000 - 10000000 + 1)) + 10000000;
    const monto = Math.floor(Math.random() * 1000) + 1;
    const tipo = Math.random() > 0.5 ? "natural" : "empresa";
    const cuenta = Math.floor(Math.random() * 1000000000) + 1;
    handleTransaction(cuenta, nombre, cedula, monto, tipo);
  }

  console.log(transactions);

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
                    value={mountAlertValue}
                    onChange={(e) => setMountAlertValue(e.target.value)}
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
                    value={accountCountAlertValue}
                    onChange={(e) => setAccountCountAlertValue(e.target.value)}
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
                    value={blackListValue}
                    onChange={(e) => setBlackListValue(e.target.value)}
                  />
                </FormControl>
                <Button onClick={() => addBlackList(blackListValue)}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-col mt-4 border rounded-md p-2 max-h-44 overflow-auto">
                {blackList.map((account, i) => (
                  <div className="flex justify-between" key={account + -+i}>
                    <p>{account}</p>
                    <Button
                      onClick={() => {
                        setBlackList(
                          blackList.filter((acc) => acc !== account)
                        );
                      }}
                    >
                      X
                    </Button>
                  </div>
                ))}
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
                    value={cuenta}
                    onChange={(e) => setCuenta(e.target.value)}
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
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
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
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
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
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
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
                      value={monto}
                      onChange={handleMontoChange}
                    />
                  </FormControl>
                  <Button onClick={() => handleTransaction(cuenta, nombre, cedula, monto, tipo)}>
                    Crear transferencia
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-between items-center w-6/12 border rounded-lg p-5">
                <p>
                  {
                    "El siguiente botón genera una transferencia con datos ficticios con el fin \
                    de simular a bajo nivel un tráfico de transacciones. El sistema generará \
                    automáticamente una alerta en cuanto detecte cualquier transacción que \
                    cumpla con las condiciones establecidas en el panel de configuración."
                  }
                </p>
                <Button onClick={genRandomTransaction}>Crear transferencia</Button>
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
            <div className="flex flex-col gap-2">
              {alerts.map((alert) => (
                <p key={alert.id} className="text-gray-600 border-b border-black">{alert.log}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ManagerComponent.propTypes = {
  email: PropTypes.string,
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
