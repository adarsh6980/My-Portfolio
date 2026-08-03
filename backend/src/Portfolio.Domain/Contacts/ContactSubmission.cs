namespace Portfolio.Domain.Contacts;

public sealed class ContactSubmission
{
    private ContactSubmission() { }

    public ContactSubmission(Guid id, string name, string email, string subject, string message, string requesterHash, DateTimeOffset createdAt)
    {
        Id = id;
        Name = name;
        Email = email;
        Subject = subject;
        Message = message;
        RequesterHash = requesterHash;
        CreatedAt = createdAt;
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Subject { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public string RequesterHash { get; private set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; private set; }
}
