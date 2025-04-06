using ExpenseTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Data;

public class ExpenseContext : DbContext
{
	public DbSet<FixedExpense> FixedExpense { get; init; }
	public DbSet<Budget> Budget { get; init; }
	public DbSet<Purchase> Purchase { get; init; }

	public ExpenseContext(DbContextOptions<ExpenseContext> options) : base(options)
	{
	}

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseSqlite(@"Data source=Data/Expenses.db");
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
	}
}