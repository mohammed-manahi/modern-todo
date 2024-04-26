using System.ComponentModel.DataAnnotations;

namespace ModernTodoBackend.Attributes;

public class SortColumnValidatorAttribute : ValidationAttribute
{
    public Type EntityType { get; set; }

    public SortColumnValidatorAttribute(Type entityType) : base("Value must match an existing column.")
    {
        EntityType = entityType;
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        // Custom validation to include only entity properties for sorting
        if (EntityType != null)
        {
            string attributeValue = value as string;
            if (!string.IsNullOrEmpty(attributeValue) && EntityType.GetProperties().Any(p => p.Name == attributeValue))
            {
                return ValidationResult.Success;
            }
        }
        return new ValidationResult(ErrorMessage);
    }
}