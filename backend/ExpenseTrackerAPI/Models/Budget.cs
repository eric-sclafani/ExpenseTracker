namespace ExpenseTrackerAPI.Models;

public class Budget
{
	public int Id { get; set; }
	public int CashIn { get; set; }
	public double CashOut { get; set; }
	public double DisposableIncome { get; set; }
}