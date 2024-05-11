import PropTypes from "prop-types";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Button, FormHelperText } from "@mui/material";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import TransactionList from "./transactions";
import emailjs from "@emailjs/browser";
import { useState } from "react";

const ManagerComponent = ({ email }) => {
  const [blackListValue, setBlackListValue] = useState("");
  const [mountAlertValue, setMountAlertValue] = useState(400);
  const [accountCountAlertValue, setAccountCountAlertValue] = useState(20);

  const [cuenta, setCuenta] = useState("");
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState(0);

  const [transactions, setTransactions] = useState({});
  const [blackList, setBlackList] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const sendEmail = (transactionData, tipo) => {
    setAlerts([
      ...alerts,
      {
        id: transactionData.id,
        log: `Enviado email a: ${email} por transaccion: \n Numero de cuenta: ${transactionData.cuenta} - Nombre: ${transactionData.nombre} - Monto: ${transactionData.monto} - Tipo de alerta: ${tipo}`,
      },
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
    inputMonto = inputMonto.replace(/[^0-9.]/g, '');

    // Verificar si el número tiene más de dos decimales
    const decimalCount = inputMonto.split('.')[1] ? inputMonto.split('.')[1].length : 0;

    if (decimalCount > 2) {
      // Si tiene más de dos decimales, truncar el exceso
      inputMonto = parseFloat(inputMonto).toFixed(2);
    }

    // Verificar si el número es negativo
    if (parseFloat(inputMonto) < 0) {
      // Si es negativo, establecerlo como 0
      inputMonto = '0.00';
    }

    // Actualizar el estado monto
    setMonto(inputMonto);
  };

  const handleTransaction = () => {

    if([cuenta, nombre, monto].some(value => value === "")) {
      return;
    }

    if(!transactions[cuenta]) {
      transactions[cuenta] = {
        transacciones: [{cuenta, nombre, monto}],
        count: 1
      };
    } else {
      transactions[cuenta].transacciones.push({cuenta, nombre, monto});
      transactions[cuenta].count++;
    }

    if (!blackList.includes(cuenta)) {
      if (parseFloat(monto) > mountAlertValue) {
        sendEmail({ cuenta, nombre, monto }, "Monto alerta");
      }
      if (transactions[cuenta].count > accountCountAlertValue) {
        transactions[cuenta].count = 0;
        sendEmail({ cuenta, nombre, monto }, "Transacciones alerta");
      }
    } else {
      sendEmail({ cuenta, nombre, monto }, "Lista negra");
    }
    setTransactions({...transactions});
    setCuenta("");
    setNombre("");
    setMonto(0);
  };

  return (
    <div className="flex flex-col items-center p-5">
      {/* Panel de opciones de aviso */}
      <div className="flex flex-col ">
        <p>Panel de control de alertas</p>
        <div className="flex flex-col">
          <div className="flex">
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "25ch" }}>
              <FormHelperText id="standard-weight-helper-text">
                Alertar con montos mayores a
              </FormHelperText>
              <Input
                type="number"
                endAdornment={<InputAdornment position="end">$</InputAdornment>}
                value={mountAlertValue}
                onChange={(e) => setMountAlertValue(e.target.value)}
              />
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "25ch" }}>
              <FormHelperText id="standard-weight-helper-text">
                Alertar al detectar
              </FormHelperText>
              <Input
                type="number"
                endAdornment={
                  <InputAdornment position="end">Operaciones</InputAdornment>
                }
                value={accountCountAlertValue}
                onChange={(e) => setAccountCountAlertValue(e.target.value)}
              />
              <FormHelperText id="standard-weight-helper-text">
                De la misma cuenta
              </FormHelperText>
            </FormControl>
          </div>
          <Button>Guardar Cambios</Button>
        </div>
        {/* Lista negra */}
        <div className="flex flex-col border rounded-lg p-5">
          <label htmlFor="lista-negra">Lista negra</label>
          <div className="flex  justify-between">
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-amount">
                Numero de cuenta
              </InputLabel>
              <Input
                type="text"
                value={blackListValue}
                onChange={(e) => setBlackListValue(e.target.value)}
              />
            </FormControl>
            <Button onClick={() => addBlackList(blackListValue)}>
              Agregar
            </Button>
          </div>
          <div className="flex flex-col mt-4">
            {blackList.map((account, i) => (
              <div className="flex justify-between" key={account + -+i}>
                <p>{account}</p>
                <Button
                  onClick={() => {
                    setBlackList(blackList.filter((acc) => acc !== account));
                  }}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Panel de simulacion */}
      <div className="dlex flex-col p-5 border rounded-lg w-full">
        <p>Panel de simulacion</p>

      <div className="flex justify-between items-center ">
        <Button>Transaccion random</Button>

        <form className="border rounded-lg p-5" >
          <p>Crear transaccion</p>
          <FormControl variant="standard" sx={{ mt: 3, width: "25ch" }}>
            <InputLabel htmlFor="standard-adornment-amount">
              Numero de cuenta
            </InputLabel>
            <Input
              type="text"
              value={cuenta}
              onChange={(e) => setCuenta(e.target.value)}
            />
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "25ch" }}>
            <InputLabel htmlFor="standard-adornment-amount">
              Nombre
            </InputLabel>
            <Input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, mt: 3, width: "25ch" }}>
            <InputLabel htmlFor="standard-adornment-amount">
              Monto
            </InputLabel>
            <Input
              type="number"
              value={monto}
              inputProps={{ step: '0.01', min: '0' }}
              onChange={handleMontoChange}
            />
          </FormControl>
          <Button onClick={handleTransaction} >Crear transaccion</Button>
        </form>

      </div>
      </div>
      {/* separador hr*/}
      <hr className="w-full mt-5" />
      {/* Lista de transacciones */}
      <div className="border rounded-lg p-5 mt-5 w-11/12 h-56 overflow-auto">
        <p>Transaciones en tiempo real</p>
        <TransactionList transactions={transactions} />
      </div>
      {/* Consola de avisos */}
      <div className="border rounded-lg p-5 mt-5 w-11/12 h-56 bg-yellow-200 overflow-auto">
        <p>Consola de avisos</p>
        {alerts.map((alert, i) => (
          <p key={alert.id + -+i}>{alert.log}</p>
        ))}
      </div>
    </div>
  );
};

ManagerComponent.propTypes = {
  email: PropTypes.string,
};

export default ManagerComponent;

// setLastEmailTransactionId(prevTransactionId => transactionData.id);
// const templateParams = {
//   user_name: transactionData.nombre,
//   user_email: email,
//   langostino: transactionData.monto,
// };

// emailjs
//   .send("report_arlet777", "template_m8ktav1", templateParams, {
//     publicKey: "TfSytZApS3kSnYAAm",
//   })
//   .then(
//     () => {
//       console.log("SUCCESS! enviado a: ", email);
//     },
//     (error) => {
//       console.log("FAILED...", error.text);
//     }
//   );
