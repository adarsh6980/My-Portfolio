using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Infrastructure;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Tests;

public sealed class InfrastructureConfigurationTests
{
    [Fact]
    public void Unsupported_database_provider_fails_instead_of_silently_selecting_sqlite()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Database:Provider"] = "SqlSever",
                ["ConnectionStrings:Portfolio"] = "not-used"
            })
            .Build();
        using var services = new ServiceCollection()
            .AddInfrastructure(configuration)
            .BuildServiceProvider();

        var exception = Assert.Throws<InvalidOperationException>(
            () => services.GetRequiredService<PortfolioDbContext>());

        Assert.Contains("Unsupported database provider", exception.Message);
    }
}
