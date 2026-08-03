using System.Net.Mail;

namespace Portfolio.Application.Contacts;

public static class ContactRequestValidator
{
    public static Dictionary<string, string[]> Validate(ContactRequest request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);
        AddRequiredAndLengthError(errors, "name", request.Name, 100, "Enter your name.");
        AddRequiredAndLengthError(errors, "subject", request.Subject, 160, "Enter a subject.");

        if (string.IsNullOrWhiteSpace(request.Email) || request.Email.Length > 254 || !IsEmail(request.Email))
            errors["email"] = ["Enter a valid email address."];

        if (string.IsNullOrWhiteSpace(request.Message) || request.Message.Trim().Length < 20 || request.Message.Length > 4000)
            errors["message"] = ["Enter a message between 20 and 4000 characters."];

        return errors;
    }

    public static ContactRequest Normalize(ContactRequest request) => new(
        Clean(request.Name),
        Clean(request.Email).ToLowerInvariant(),
        Clean(request.Subject),
        Clean(request.Message, preserveLineBreaks: true),
        Clean(request.Website));

    private static void AddRequiredAndLengthError(Dictionary<string, string[]> errors, string key, string? value, int maximum, string requiredMessage)
    {
        if (string.IsNullOrWhiteSpace(value)) errors[key] = [requiredMessage];
        else if (value.Length > maximum) errors[key] = [$"Use no more than {maximum} characters."];
    }

    private static bool IsEmail(string value)
    {
        try { return new MailAddress(value).Address == value.Trim(); }
        catch (FormatException) { return false; }
    }

    private static string Clean(string? value, bool preserveLineBreaks = false)
    {
        var safe = (value ?? string.Empty).Where(character => !char.IsControl(character) || (preserveLineBreaks && character is '\n' or '\r' or '\t'));
        return new string(safe.ToArray()).Trim();
    }
}
