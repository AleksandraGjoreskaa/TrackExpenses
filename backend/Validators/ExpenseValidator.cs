using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public class CreateExpenseDtoValidator : AbstractValidator<CreateExpenseDto>
{
    public CreateExpenseDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than 0.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required.")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required.");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required.")
            .Must(t => t == "Income" || t == "Expense")
            .WithMessage("Type must be 'Income' or 'Expense'.");
    }
}

public class UpdateExpenseDtoValidator : AbstractValidator<UpdateExpenseDto>
{
    public UpdateExpenseDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than 0.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required.")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required.");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required.")
            .Must(t => t == "Income" || t == "Expense")
            .WithMessage("Type must be 'Income' or 'Expense'.");
    }
}

