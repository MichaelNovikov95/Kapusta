import { ConfirmActionModal } from 'components/Modal/QuestionModal';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useGetExpenseQuery,
  useGetIncomeQuery,
  useDeleteTransactionMutation,
} from 'redux/transaction/transactionOperations';

import s from './TransactionDetails.module.css';

export const TransactionDetails = () => {
  const [modal, setModal] = useState(false);
  const [transactionOnDeleteId, setTransactionOnDeleteId] = useState('');
  const location = useLocation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const { data: expenseData = [] } = useGetExpenseQuery();
  const { data: incomeData = [] } = useGetIncomeQuery();

  const { expenses } = expenseData;
  const { incomes } = incomeData;

  const transactionsType =
    location.pathname === '/transactions/expenses' ? expenses : incomes;

  const handleDeleteTransaction = async id => {
    setModal(false);
    try {
      await deleteTransaction(id).unwrap();
    } catch (error) {
      return error.message;
    }
  };
  const onDelete = id => {
    setModal(true);
    setTransactionOnDeleteId(id);
  };

  const normalize = amount => {
    if (location.pathname === '/transactions/expenses') {
      const amountNormalizer =
        '- ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' грн.';
      return amountNormalizer;
    } else {
      const amountNormalizer =
        '+ ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' грн.';
      return amountNormalizer;
    }
  };

  const summStyle =
    location.pathname === '/transactions/expenses' ? s.minus : s.plus;

  return (
    <>
      <div className={s.scrollTable}>
        <table>
          <thead className={s.tableHead}>
            <tr>
              <th className={s.table__head__empty}></th>
              <th className={s.table__head__date}>DATE</th>
              <th className={s.table__head__text}>DESCRIPTION</th>
              <th className={s.table__head__category}>CATEGORY</th>
              <th className={s.table__head__sum}>SUM</th>
              <th className={s.table__head__delete}></th>
            </tr>
          </thead>
        </table>
        <div className={s.scrollTableBody}>
          <table>
            <tbody>
              {transactionsType
                ?.map(item => (
                  <tr className={s.body} key={item._id}>
                    <td className={s.body__empty}></td>
                    <td className={s.body__date}>{item.date}</td>
                    <td className={s.body__description}>{item.description}</td>
                    <td className={s.body__category}>{item.category}</td>
                    <td className={summStyle}>{normalize(item.amount)}</td>
                    <td className={s.body__delete}>
                      <button
                        onClick={() => onDelete(item._id)}
                        type="button"
                        className={s.btnDelete}
                      ></button>
                    </td>
                  </tr>
                ))
                ?.reverse()}
            </tbody>
          </table>
        </div>
        {modal && (
          <ConfirmActionModal
            title="Are you sure?"
            onClickYes={() => handleDeleteTransaction(transactionOnDeleteId)}
            onClickNo={() => setModal(false)}
          />
        )}
      </div>
    </>
  );
};
