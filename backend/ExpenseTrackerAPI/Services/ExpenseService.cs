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

		return result;
	}

	public IEnumerable<FixedExpense> GetFixedExpenses()
	{
		return _context.FixedExpense.ToList();
	}

	public DynamicResult<FixedExpense> AddFixedExpense(string category, int amount)
	{
		var result = new DynamicResult<FixedExpense>();

		var newExpense = new FixedExpense()
		{
			Category = category,
			Amount = amount
		};

		try
		{
			_context.FixedExpense.Add(newExpense);
			_context.SaveChanges();
			result.Data = newExpense;
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
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

		return result;
	}
}