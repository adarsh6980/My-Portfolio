using Portfolio.Application.Contacts;
using Portfolio.Domain.Contacts;

namespace Portfolio.Tests;

public sealed class ContactApplicationTests
{
    [Fact]
    public void Validator_reports_required_email_and_message_constraints()
    {
        var errors = ContactRequestValidator.Validate(new ContactRequest(" ", "not-an-email", "", "too short"));

        Assert.Equal(["Enter your name."], errors["name"]);
        Assert.Equal(["Enter a valid email address."], errors["email"]);
        Assert.Equal(["Enter a subject."], errors["subject"]);
        Assert.Equal(["Enter a message between 20 and 4000 characters."], errors["message"]);
    }

    [Fact]
    public void Normalization_trims_values_removes_control_characters_and_preserves_message_lines()
    {
        var normalized = ContactRequestValidator.Normalize(new ContactRequest(
            "  Ada\u0000  ",
            "  ADA@Example.com  ",
            "  A\u0007 role  ",
            "  First line\nSecond\tline\u0000  ",
            "  bot\u0000  "));

        Assert.Equal("Ada", normalized.Name);
        Assert.Equal("ada@example.com", normalized.Email);
        Assert.Equal("A role", normalized.Subject);
        Assert.Equal("First line\nSecond\tline", normalized.Message);
        Assert.Equal("bot", normalized.Website);
    }

    [Fact]
    public async Task Service_persists_normalized_data_and_returns_a_neutral_receipt()
    {
        var repository = new RecordingContactRepository();
        var service = new ContactSubmissionService(repository);

        var response = await service.SubmitAsync(
            new ContactRequest("  Ada  ", "ADA@EXAMPLE.COM", "  Role  ", "  A sufficiently detailed message.  "),
            "REQUESTER_HASH",
            CancellationToken.None);

        Assert.NotNull(repository.Submission);
        Assert.Equal("Ada", repository.Submission.Name);
        Assert.Equal("ada@example.com", repository.Submission.Email);
        Assert.Equal("Role", repository.Submission.Subject);
        Assert.Equal("A sufficiently detailed message.", repository.Submission.Message);
        Assert.Equal("REQUESTER_HASH", repository.Submission.RequesterHash);
        Assert.Equal(repository.Submission.Id.ToString("N"), response.Id);
        Assert.Equal("Message received.", response.Message);
    }

    [Fact]
    public async Task Service_refuses_invalid_data_even_when_called_outside_the_http_endpoint()
    {
        var repository = new RecordingContactRepository();
        var service = new ContactSubmissionService(repository);

        await Assert.ThrowsAsync<ArgumentException>(() => service.SubmitAsync(
            new ContactRequest("", "invalid", "", "short"),
            "REQUESTER_HASH",
            CancellationToken.None));

        Assert.Null(repository.Submission);
    }

    private sealed class RecordingContactRepository : IContactSubmissionRepository
    {
        public ContactSubmission? Submission { get; private set; }

        public Task AddAsync(ContactSubmission submission, CancellationToken cancellationToken)
        {
            Submission = submission;
            return Task.CompletedTask;
        }
    }
}
