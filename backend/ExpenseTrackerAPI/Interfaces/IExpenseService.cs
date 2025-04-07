using ExpenseTrackerAPI.Models;

namespace ExpenseTrackerAPI.Interfaces;

public interface IExpenseService
{
	public Budget? GetBudget();
	public DynamicResult<Budget> UpdateCashIn(int cashIn);
	
	public IEnumerable<FixedExpense> GetFixedExpenses();
	public DynamicResult<FixedExpense> AddFixedExpense(string category, int amount);
	public DynamicResult<FixedExpense> UpdateFixedExpense(int id, string? category, int? amount);
	public DynamicResult<FixedExpense> DeleteFixedExpense(int id);
}