import PropTypes from 'prop-types';
import { format } from 'date-fns';

const TransactionList = ({ transactions }) => {

  const formatDate = (date) => {
    const formattedDate = format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
    return formattedDate;
  }

  const sortedAccounts = Object.keys(transactions).sort((a, b) => {
    const latestTransactionA = transactions[a].transacciones[0].dateTime;
    const latestTransactionB = transactions[b].transacciones[0].dateTime;
    return new Date(latestTransactionB) - new Date(latestTransactionA);
  });

  return (
    <div className="">
        {sortedAccounts.map((account) => (
          transactions[account].transacciones.map((transaction, index) => (
            <p key={index} className="text-gray-600 border-b border-black">
              Fecha: {formatDate(transaction.dateTime)} - Ref: {transaction.id} - Nombre: {transaction.nombre} - Cedula: {transaction.cedula} - Monto: {transaction.monto}$ - Tipo: {transaction.tipo}
            </p>
          ))
        ))}
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.object,
};

export default TransactionList;
