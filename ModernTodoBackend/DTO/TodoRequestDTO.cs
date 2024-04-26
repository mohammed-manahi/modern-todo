using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using ModernTodoBackend.Attributes;

namespace ModernTodoBackend.DTO;

public class TodoRequestDTO
{
    [DefaultValue(0)] 
    public int PageIndex { get; set; } = 0;

    [DefaultValue(10)]
    [Range(1, 100)] 
    public int PageSize { get; set; }

    [DefaultValue("Name")]
    [SortColumnValidator(typeof(TodoDTO))]
    public string? SortColumn { get; set; } = "Name";

    [DefaultValue("ASC")]
    [SortOrderValidator]
    public string? SortOrder { get; set; } = "ASC";

    [DefaultValue(null)] 
    public string? FilterQuery { get; set; } = null;
}