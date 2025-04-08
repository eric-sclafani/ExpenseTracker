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

	private ObjectResult ApiResponse<T>(DynamicResult<T> result)
	{
		return result.StatusCode switch
		{
			400 => BadRequest(result.Message),
			500 => StatusCode(500, $"Internal server error: {result.Message}"),
			_ => Ok(result)
		};
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
		return ApiResponse(result);
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
		return ApiResponse(result);
	}


	[HttpPatch]
	public IActionResult UpdateFixedExpense(FixedExpense expense)
	{
		if (expense.Amount <= 0)
		{
			return BadRequest("Error: param 'amount' must be greater than 0");
		}

		var result = _expenseService.UpdateFixedExpense(expense);
		return ApiResponse(result);
	}

	[HttpDelete]
	public IActionResult DeleteFixedExpense(int id)
	{
		var result = _expenseService.DeleteFixedExpense(id);
		return ApiResponse(result);
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
		return ApiResponse(result);
	}

	[HttpPatch]
	public IActionResult UpdatePurchase(Purchase purchase)
	{
		var result = _expenseService.UpdatePurchase(purchase);
		return ApiResponse(result);
	}
	
	[HttpDelete]
	public IActionResult DeletePurchase(int id)
	{
		var result = _expenseService.DeletePurchase(id);
		return ApiResponse(result);
	}
}