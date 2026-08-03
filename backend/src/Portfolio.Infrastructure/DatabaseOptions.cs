namespace Portfolio.Infrastructure;

public sealed class DatabaseOptions
{
    public const string SectionName = "Database";
    public string Provider { get; init; } = "Sqlite";
    public bool ApplyMigrationsOnStartup { get; init; }
}
