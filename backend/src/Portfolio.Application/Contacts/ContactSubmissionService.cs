using Portfolio.Domain.Contacts;

namespace Portfolio.Application.Contacts;

public sealed class ContactSubmissionService(IContactSubmissionRepository repository) : IContactSubmissionService
{
    public async Task<ContactResponse> SubmitAsync(ContactRequest request, string requesterHash, CancellationToken cancellationToken)
    {
        var normalized = ContactRequestValidator.Normalize(request);
        if (ContactRequestValidator.Validate(normalized).Count > 0)
            throw new ArgumentException("Contact request is invalid after normalization.", nameof(request));
        var submission = new ContactSubmission(Guid.NewGuid(), normalized.Name, normalized.Email, normalized.Subject, normalized.Message, requesterHash, DateTimeOffset.UtcNow);
        await repository.AddAsync(submission, cancellationToken);
        return new ContactResponse(submission.Id.ToString("N"), "Message received.");
    }
}
