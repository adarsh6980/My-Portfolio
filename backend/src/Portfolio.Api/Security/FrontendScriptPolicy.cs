using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Portfolio.Api.Security;

public static partial class FrontendScriptPolicy
{
    public static string BuildDirective(string? indexHtml)
    {
        var hashes = ScriptTagPattern().Matches(indexHtml ?? string.Empty)
            .Where(match => !SourceAttributePattern().IsMatch(match.Groups["attributes"].Value))
            .Select(match => Convert.ToBase64String(SHA256.HashData(
                Encoding.UTF8.GetBytes(match.Groups["content"].Value))))
            .Distinct(StringComparer.Ordinal)
            .Select(hash => $"'sha256-{hash}'");

        return string.Join(' ', new[] { "script-src", "'self'", "'wasm-unsafe-eval'" }.Concat(hashes));
    }

    [GeneratedRegex("<script\\b(?<attributes>[^>]*)>(?<content>[\\s\\S]*?)</script>", RegexOptions.IgnoreCase)]
    private static partial Regex ScriptTagPattern();

    [GeneratedRegex("\\bsrc\\s*=", RegexOptions.IgnoreCase)]
    private static partial Regex SourceAttributePattern();
}
