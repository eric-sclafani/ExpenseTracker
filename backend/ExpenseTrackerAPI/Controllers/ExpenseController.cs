using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ExpenseController : ControllerBase
{
	private readonly ExpenseContext _context;

	public ExpenseController(ExpenseContext context)
	{
		_context = context;
	}

	[HttpGet]
	public IActionResult GetBudget()
	{
		var budget = _context.Budget.FirstOrDefault();
		if (budget is not null)
		{
			return Ok(budget);
		}

		return NotFound();
	}

	[HttpGet]
	public ActionResult<IEnumerable<FixedExpense>> GetFixedExpenses()
	{
		var expenses = _context.FixedExpense.ToList();
		return Ok(expenses);
	}

	[HttpPost]
	public async Task<IActionResult> SetCashIn(int cashIn)
	{
		if (cashIn <= 0)
		{
			return BadRequest("Error: param 'cashIn' must be greater than 0");
		}

		var record = _context.Budget.FirstOrDefault();
		if (record is not null)
		{
			record.CashIn = cashIn;
			await _context.SaveChangesAsync();
			return Ok(record);
		}

		var budget = new Budget()
		{
			CashIn = cashIn
		};
		_context.Add(budget);
		await _context.SaveChangesAsync();

		return Ok(budget);
	}

	[HttpPost]
	public async Task<IActionResult> SetFixedExpense(int? id, string? category, int? amount)
	{
		if (amount <= 0)
		{
			return BadRequest("Error: param 'amount' must be greater than 0");
		}


		if (id is null)
		{
			var newExpense = new FixedExpense()
			{
				Category = category,
				Amount = amount
			};

			await _context.FixedExpense.AddAsync(newExpense);
			await _context.SaveChangesAsync();
			return Ok(newExpense);
		}

		var expense = _context.FixedExpense.FirstOrDefault();
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


			await _context.SaveChangesAsync();
			return Ok(expense);
		}

		return NotFound(id);
	}

	[HttpDelete]
	public async Task<IActionResult> DeleteFixedExpense(int id)
	{
		var expense = _context.FixedExpense.FirstOrDefault();
		if (expense is not null)
		{
			_context.FixedExpense.Remove(expense);
			await _context.SaveChangesAsync();
			return Ok(expense);
		}

		return NotFound(id);
	}
}