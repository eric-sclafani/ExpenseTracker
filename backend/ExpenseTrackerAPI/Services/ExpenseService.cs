using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Interfaces;
using ExpenseTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Services;

public class ExpenseService : IExpenseService
{
	private readonly ExpenseContext _context;

	public ExpenseService(ExpenseContext context)
	{
		_context = context;
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

	private DynamicResult<T> AddEntity<T>(T Data, Action dbChange)
	{
		var result = new DynamicResult<T>();
		try
		{
			dbChange();
			_context.SaveChanges();
			result.Data = Data;
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
		}

		return result;
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
		var result = AddEntity(expense, () => _context.FixedExpense.Add(expense));
		if (result.Success)
		{
			CalculateBudget();
		}

		return result;
	}

	public DynamicResult<FixedExpense> UpdateFixedExpense(FixedExpense expense)
	{
		var result = new DynamicResult<FixedExpense>();
		try
		{
			var record = _context.FixedExpense.Find(expense.Id);
			if (record is not null)
			{
				_context.Entry(record).CurrentValues.SetValues(expense);
				_context.SaveChanges();
				result.Data = expense;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Fixed expense with id '{expense.Id}' not found";
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
			result.StatusCode = 500;
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
		var result = AddEntity(purchase, () => _context.Purchase.Add(purchase));
		return result;
	}

	public DynamicResult<Purchase> UpdatePurchase(Purchase purchase)
	{
		var result = new DynamicResult<Purchase>();
		try
		{
			var record = _context.Purchase.Find(purchase.Id);
			if (record is not null)
			{
				_context.Entry(record).CurrentValues.SetValues(purchase);
				_context.SaveChanges();
				result.Data = purchase;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Purchase with id '{purchase.Id}' not found";
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

	public DynamicResult<Purchase> DeletePurchase(int id)
	{
		var result = new DynamicResult<Purchase>();
		try
		{
			var purchase = _context.Purchase.Find(id);
			if (purchase is not null)
			{
				_context.Purchase.Remove(purchase);
				_context.SaveChanges();
				result.Data = purchase;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Purchase with id '{id}' not found";
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
}