using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public class CreateCategoryDtoValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Icon).NotEmpty().MaximumLength(10);
        RuleFor(x => x.Color).NotEmpty().Matches("^#([A-Fa-f0-9]{6})$")
            .WithMessage("Color must be a valid hex color (e.g. #FF5733).");
    }
}

public class UpdateCategoryDtoValidator : AbstractValidator<UpdateCategoryDto>
{
    public UpdateCategoryDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Icon).NotEmpty().MaximumLength(10);
        RuleFor(x => x.Color).NotEmpty().Matches("^#([A-Fa-f0-9]{6})$")
            .WithMessage("Color must be a valid hex color (e.g. #FF5733).");
    }
}

public class CreateBudgetDtoValidator : AbstractValidator<CreateBudgetDto>
{
    public CreateBudgetDtoValidator()
    {
        RuleFor(x => x.CategoryId).GreaterThan(0);
        RuleFor(x => x.MonthlyLimit).GreaterThan(0).WithMessage("Monthly limit must be greater than 0.");
    }
}

public class UpdateBudgetDtoValidator : AbstractValidator<UpdateBudgetDto>
{
    public UpdateBudgetDtoValidator()
    {
        RuleFor(x => x.MonthlyLimit).GreaterThan(0).WithMessage("Monthly limit must be greater than 0.");
    }
}

