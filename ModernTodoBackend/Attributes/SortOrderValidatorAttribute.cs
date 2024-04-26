using System.ComponentModel.DataAnnotations;

namespace ModernTodoBackend.Attributes;

public class SortOrderValidatorAttribute : ValidationAttribute
{
    public string[] AllowedValues { get; set; } = new[] { "ASC", "DESC" };

    public SortOrderValidatorAttribute() : base("Value must be one of the following {0}.")
    {
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        // Validate sort order options as asc and desc only
        string attributeValue = value as string;
        if (!string.IsNullOrEmpty(attributeValue) && AllowedValues.Contains(attributeValue))
        {
            return ValidationResult.Success;
        }
        return new ValidationResult(FormatErrorMessage(string.Join(",", AllowedValues)));
    }
}