using Portfolio.Application.Contacts;
using Portfolio.Domain.Contacts;

namespace Portfolio.Infrastructure.Persistence;

public sealed class ContactSubmissionRepository(PortfolioDbContext dbContext) : IContactSubmissionRepository
{
    public async Task AddAsync(ContactSubmission submission, CancellationToken cancellationToken)
    {
        dbContext.ContactSubmissions.Add(submission);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
