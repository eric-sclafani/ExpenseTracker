using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Interfaces;
using ExpenseTrackerAPI.Models;

namespace ExpenseTrackerAPI.Services;

public class ExpenseService : IExpenseService
{
	private readonly ExpenseContext _context;

	public ExpenseService(ExpenseContext context)
	{
		_context = context;
	}

	public Budget? GetBudget()
	{
		return _context.Budget.FirstOrDefault();
	}

	private void CalculateBudget()
	{
		var budget = _context.Budget.FirstOrDefault();
		var cashOut = _context.FixedExpense.Sum(f => f.Amount);
		if (budget is not null && cashOut is not null)
		{
			budget.CashOut = cashOut ?? 0;
			budget.DisposableIncome = budget.CashIn - cashOut ?? 0;
			_context.SaveChanges();
		}
	}

	public DynamicResult<Budget> UpdateCashIn(int cashIn)
	{
		var result = new DynamicResult<Budget>();
		try
		{
			var record = _context.Budget.FirstOrDefault();
			if (record is not null)
			{
				record.CashIn = cashIn;
				_context.SaveChanges();
				result.Data = record;
			}
			else
			{
				var budget = new Budget()
				{
					CashIn = cashIn
				};
				_context.Add(budget);
				_context.SaveChanges();
				result.Data = budget;
			}
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
		}

		if (result.Success)
		{
			CalculateBudget();
		}

		return result;
	}

	public IEnumerable<FixedExpense> GetFixedExpenses()
	{
		return _context.FixedExpense.ToList();
	}

	public DynamicResult<FixedExpense> AddFixedExpense(FixedExpense expense)
	{
		var result = new DynamicResult<FixedExpense>();

		try
		{
			_context.FixedExpense.Add(expense);
			_context.SaveChanges();
			result.Data = expense;
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
		}

		if (result.Success)
		{
			CalculateBudget();
		}

		return result;
	}

	public DynamicResult<FixedExpense> UpdateFixedExpense(int id, string? category, int? amount)
	{
		var result = new DynamicResult<FixedExpense>();
		try
		{
			var expense = _context.FixedExpense.Find(id);
			if (expense is not null)
			{
				if (category is not null)
				{
					expense.Category = category;
				}

				if (amount is not null)
				{
					expense.Amount = amount;
				}

				_context.SaveChanges();
				result.Data = expense;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Fixed expense with id '{id}' not found";
			}
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
		}

		if (result.Success)
		{
			CalculateBudget();
		}

		return result;
	}

	public DynamicResult<FixedExpense> DeleteFixedExpense(int id)
	{
		var result = new DynamicResult<FixedExpense>();
		try
		{
			var expense = _context.FixedExpense.Find(id);
			if (expense is not null)
			{
				_context.FixedExpense.Remove(expense);
				_context.SaveChanges();
				result.Data = expense;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Fixed expense with id '{id}' not found";
			}
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
		}

		if (result.Success)
		{
			CalculateBudget();
		}

		return result;
	}

	public IEnumerable<Purchase> GetPurchases()
	{
		return _context.Purchase.ToList();
	}

	public DynamicResult<Purchase> AddPurchase(Purchase purchase)
	{
		var result = new DynamicResult<Purchase>();

		try
		{
			_context.Purchase.Add(purchase);
			_context.SaveChanges();
			result.Data = purchase;
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
		}

		return result;
	}
}