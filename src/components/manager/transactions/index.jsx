import PropTypes from 'prop-types';
import { format } from 'date-fns';

const TransactionList = ({ transactions }) => {

  // crear funcion usando date-fns para dar formato de fecha
  // a la fecha de las transacciones
 
  const formatDate = (date) => {
    const formattedDate = format(new Date(date), 'dd/MM/yyyy: HH:mm:ss');
    return formattedDate;
  }

  return (
    <div className="">

        {Object.keys(transactions).map((account) => (
          transactions[account].transacciones.map((transaction, index) => (
            <p key={index} className="text-sm text-gray-600">
              Fecha: {formatDate(transaction.dateTime)} - Ref: {transaction.id} - Nombre: {transaction.nombre} - Cedula: {transaction.cedula} - Monto: {transaction.monto}$ - Tipo: {transaction.tipo}
            </p>
          ))
        ))}

    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array,
};

export default TransactionList;