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
import { useState } from "react";
import TransactionList from "./transactions";
import emailjs from "@emailjs/browser";
import { genId } from "../../helpers/genId";
import { format } from "date-fns";
import { useEffect } from "react";
import Swal from "sweetalert2";

const ManagerComponent = ({ email, setEmail }) => {
  const [mountAlertValue, setMountAlertValue] = useState(() => {
    const storedValue = localStorage.getItem("mountAlertValue");
    return storedValue ? JSON.parse(storedValue) : 400;
  });
  const [accountCountAlertValue, setAccountCountAlertValue] = useState(() => {
    const storedValue = localStorage.getItem("accountCountAlertValue");
    return storedValue ? JSON.parse(storedValue) : 20;
  });
  const [blackListValue, setBlackListValue] = useState("");

  const [cuenta, setCuenta] = useState("");
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [tipo, setTipo] = useState("");
  const [monto, setMonto] = useState(0);

  const [cuentaEnvia, setCuentaEnvia] = useState("");
  const [nombreEnvia, setNombreEnvia] = useState("");
  const [cedulaEnvia, setCedulaEnvia] = useState("");
  const [tipoEnvia, setTipoEnvia] = useState("");


  const [blackList, setBlackList] = useState(() => {
    const storedValue = localStorage.getItem("blackList");
    return storedValue ? JSON.parse(storedValue) : [];
  });
  const [transactions, setTransactions] = useState(() => {
    const storedValue = localStorage.getItem("transactions");
    return storedValue ? JSON.parse(storedValue) : {};
  });
  const [alerts, setAlerts] = useState(() => {
    const storedValue = localStorage.getItem("alerts");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  const formatDate = (date) => {
    const formattedDate = format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
    return formattedDate;
  }

  const sendEmail = (transactionData, tipo) => {

    setAlerts([
      {
        id: transactionData.id,
        log: `${formatDate(new Date())} Correo enviado a ${email} por transaccion: Ref: ${transactionData.id} \
             - Cuenta de destino: ${transactionData.cuenta} - Cuenta de origen: ${transactionData.cuentaEnvia} \
             - transferencia a favor de: ${transactionData.nombre} - por parte de: ${transactionData.nombreEnvia} \
             - Monto: ${transactionData.monto} - Tipo de alerta: ${tipo}`,
      },
      ...alerts,
    ]);

    const templateParams = {
      ...transactionData,
      to_email: email,
      alertType: tipo,
      dateTime: formatDate(transactionData.dateTime),
    };

    emailjs
    .send("bavalerts24", "bavtemplate24", templateParams, {
      publicKey: "lYLvpucmUn11De82N",
    })
    .then(() => {
      console.log("SUCCESS! enviado a: ", email);
    },
    (error) => {
      console.log("FAILED...", error.text);
    }
  );
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

    inputMonto = inputMonto.replace(/[^0-9.]/g, "");

    const decimalCount = inputMonto.split(".")[1]
      ? inputMonto.split(".")[1].length
      : 0;

    if (decimalCount > 2) {
      inputMonto = parseFloat(inputMonto).toFixed(2);
    }

    if (parseFloat(inputMonto) < 0) {
      inputMonto = "0.00";
    }

    setMonto(inputMonto);
  };

  const handleTransaction = (cuenta, cuentaEnvia, nombreEnvia, cedulaEnvia, tipoEnvia, nombre, cedula, monto, tipo) => {
    if ([cuenta, nombre, cedula, monto, tipo, nombreEnvia, cedulaEnvia, tipoEnvia].some((value) => value === "")) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Todos los campos son obligatorios",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (cuenta.length !== 20 || cuentaEnvia.length !== 20) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Los numero de cuenta deben tener 20 digitos",
        showConfirmButton: false,
        timer: 1500,
      });
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
      cuentaEnvia,
      nombreEnvia,
      cedulaEnvia,
      tipoEnvia,
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

    if (!blackList.includes(cuenta) && !blackList.includes(cuentaEnvia)) {
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
    setCuentaEnvia("");
    setNombreEnvia("");
    setCedulaEnvia("");
    setTipoEnvia("");
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

  const generateRandomNumber = () => {
    let randomNumber = '';
    for (let i = 0; i < 19; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    randomNumber = '1' + randomNumber;
    return randomNumber;
  };

  const genRandomTransaction = () => {
    const nombre = genRnadomNombre();
    const cedula = Math.floor(Math.random() * (25000000 - 10000000 + 1)) + 10000000;
    const monto = Math.floor(Math.random() * 1000) + 1;
    const tipo = Math.random() > 0.5 ? "natural" : "empresa";
    const cuenta = generateRandomNumber();
    const cuentaEnvia = generateRandomNumber();
    const nombreEnvia = genRnadomNombre();
    const cedulaEnvia = Math.floor(Math.random() * (25000000 - 10000000 + 1)) + 10000000;
    const tipoEnvia = Math.random() > 0.5 ? "natural" : "empresa";
    handleTransaction(cuenta, cuentaEnvia, nombreEnvia, cedulaEnvia, tipoEnvia, nombre, cedula, monto, tipo);
  }

  const handleDelLocalStorage = () => {
    localStorage.clear();
    setMountAlertValue(400);
    setAccountCountAlertValue(20);
    setBlackList([]);
    setTransactions({});
    setAlerts([]);
  }

  const handleLogOut = () => {
    setEmail("");
    localStorage.setItem("email", "");
  }

    useEffect(() => {
      localStorage.setItem("mountAlertValue", mountAlertValue);
      localStorage.setItem("accountCountAlertValue", accountCountAlertValue);
      localStorage.setItem("blackList", JSON.stringify(blackList));
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("alerts", JSON.stringify(alerts));
    }, [mountAlertValue, accountCountAlertValue, blackList, transactions, alerts]);

    useEffect(() => {
      const storedMountAlertValue = localStorage.getItem("mountAlertValue");
      const storedAccountCountAlertValue = localStorage.getItem("accountCountAlertValue");
      const storedBlackList = localStorage.getItem("blackList");
      const storedTransactions = localStorage.getItem("transactions");
      const storedAlerts = localStorage.getItem("alerts");
  
      if (storedMountAlertValue) {
        setMountAlertValue(JSON.parse(storedMountAlertValue));
      }
      if (storedAccountCountAlertValue) {
        setAccountCountAlertValue(JSON.parse(storedAccountCountAlertValue));
      }
      if (storedBlackList) {
        setBlackList(JSON.parse(storedBlackList));
      }
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts));
      }
    }, []);

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
              <Button variant="contained" color="warning" className="w-full" sx={{my: "10px"}} onClick={handleLogOut}>Cerrar sesión</Button>
              <Button variant="contained" color="error" className="w-full" onClick={handleDelLocalStorage}>Reiniciar base de datos</Button>
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
                <FormControl variant="standard" className="w-full">
                  <FormHelperText id="standard-weight-helper-text">
                    Numero de cuenta de quien envia
                  </FormHelperText>
                  <TextField
                    type="text"
                    placeholder="Numero de cuenta"
                    variant="outlined"
                    size="small"
                    value={cuentaEnvia}
                    onChange={(e) => setCuentaEnvia(e.target.value)}
                  />
                </FormControl>
                <div className="flex justify-between items-center gap-2">
                  <FormControl variant="standard" className="w-full">
                    <FormHelperText id="standard-weight-helper-text">
                      Nombre de quien envia
                    </FormHelperText>
                    <TextField
                      type="text"
                      placeholder="Nombre"
                      variant="outlined"
                      size="small"
                      value={nombreEnvia}
                      onChange={(e) => setNombreEnvia(e.target.value)}
                    />
                  </FormControl>
                  <FormControl variant="standard" className="w-full">
                    <FormHelperText id="standard-weight-helper-text">
                      Cedula de quien envia
                    </FormHelperText>
                    <TextField
                      type="text"
                      placeholder="Cedula"
                      variant="outlined"
                      size="small"
                      value={cedulaEnvia}
                      onChange={(e) => setCedulaEnvia(e.target.value)}
                    />
                  </FormControl>
                  <FormControl variant="outlined" className="w-full">
                    <FormHelperText sx={{ m: "0px" }}>
                      Tipo de cuenta de quien envia
                    </FormHelperText>

                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                      size="small"
                      value={tipoEnvia}
                      onChange={(e) => setTipoEnvia(e.target.value)}
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
  setEmail: PropTypes.func,
};

export default ManagerComponent;
