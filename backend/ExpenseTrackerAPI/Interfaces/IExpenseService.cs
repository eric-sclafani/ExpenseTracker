using ExpenseTrackerAPI.Models;

namespace ExpenseTrackerAPI.Interfaces;

public interface IExpenseService
{
	public Budget? GetBudget();
	public DynamicResult<Budget> UpdateCashIn(int cashIn);
	
	public IEnumerable<FixedExpense> GetFixedExpenses();
	public DynamicResult<FixedExpense> AddFixedExpense(FixedExpense expense);
	public DynamicResult<FixedExpense> UpdateFixedExpense(FixedExpense expense);
	public DynamicResult<FixedExpense> DeleteFixedExpense(int id);

	public IEnumerable<Purchase> GetPurchases();
	public DynamicResult<Purchase> AddPurchase(Purchase purchase);
	public DynamicResult<Purchase> UpdatePurchase(Purchase purchase);
	public DynamicResult<Purchase> DeletePurchase(int id);
}
