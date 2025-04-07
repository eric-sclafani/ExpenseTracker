using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Interfaces;
using ExpenseTrackerAPI.Models;
using ExpenseTrackerAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class ExpenseController : ControllerBase
{
	private readonly IExpenseService _expenseService;

	public ExpenseController(IExpenseService expenseService)
	{
		_expenseService = expenseService;
	}

	private ObjectResult ServerError(string message)
	{
		return StatusCode(500, $"Internal server error: {message}");
	}

	[HttpGet]
	public IActionResult GetBudget()
	{
		var result = _expenseService.GetBudget();
		return result != null ? Ok(result) : NotFound("Budget record not found");
	}

	[HttpPost]
	public IActionResult SetCashIn(int cashIn)
	{
		if (cashIn <= 0)
		{
			return BadRequest("param 'cashIn' must be greater than 0");
		}

		var result = _expenseService.UpdateCashIn(cashIn);
		return result.Success
			? Ok(result.Data)
			: ServerError(result.Message);
	}

	[HttpGet]
	public ActionResult<IEnumerable<FixedExpense>> GetFixedExpenses()
	{
		var expenses = _expenseService.GetFixedExpenses();
		return Ok(expenses);
	}

	[HttpPost]
	public IActionResult NewFixedExpense(FixedExpense expense)
	{
		if (expense.Amount <= 0)
		{
			return BadRequest("Error: param 'amount' must be greater than 0");
		}

		var result = _expenseService.AddFixedExpense(expense);
		return result.Success
			? Ok(result.Data)
			: ServerError(result.Message);
	}


	[HttpPatch]
	public IActionResult UpdateFixedExpense(int id, string? category, int? amount)
	{
		if (amount <= 0)
		{
			return BadRequest("Error: param 'amount' must be greater than 0");
		}

		var result = _expenseService.UpdateFixedExpense(id, category, amount);

		if (result.StatusCode == 400)
		{
			return BadRequest(result.Message);
		}
		else
		{
			return Ok(result);
		}
	}

	[HttpDelete]
	public IActionResult DeleteFixedExpense(int id)
	{
		var result = _expenseService.DeleteFixedExpense(id);
		if (result.StatusCode == 400)
		{
			return BadRequest(result.Message);
		}
		else
		{
			return Ok(result);
		}
	}

	[HttpGet]
	public ActionResult<IEnumerable<Purchase>> GetPurchases()
	{
		var purchases = _expenseService.GetPurchases();
		return Ok(purchases);
	}

	[HttpPost]
	public IActionResult AddPurchase(Purchase purchase)
	{
		var result = _expenseService.AddPurchase(purchase);
		return result.Success
			? Ok(result.Data)
			: ServerError(result.Message);
	}
}