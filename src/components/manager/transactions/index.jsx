const TransactionList = ({ transactions }) => {

  return (
    <div className="">
      <ul>
        {Object.keys(transactions).map((account) => (
          transactions[account].transacciones.map((transaction, index) => (
            <li key={`${account}-${index}`}>
              <div>Cuenta: {transaction.cuenta}</div>
              <div>Nombre: {transaction.nombre}</div>
              <div>Monto: {transaction.monto}</div>
              <hr />
            </li>
          ))
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;