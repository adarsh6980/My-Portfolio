namespace Portfolio.Application.Contacts;

public sealed record ContactRequest(string Name, string Email, string Subject, string Message, string Website = "");

public sealed record ContactResponse(string Id, string Message);

public interface IContactSubmissionService
{
    Task<ContactResponse> SubmitAsync(ContactRequest request, string requesterHash, CancellationToken cancellationToken);
}

public interface IContactSubmissionRepository
{
    Task AddAsync(Domain.Contacts.ContactSubmission submission, CancellationToken cancellationToken);
}
