using Portfolio.Api.Security;

namespace Portfolio.Tests;

public sealed class FrontendScriptPolicyTests
{
    [Fact]
    public void Builds_hash_based_script_directive_for_exported_Next_hydration_scripts()
    {
        const string indexHtml = """
            <!doctype html>
            <script src="/_next/static/chunks/app.js"></script>
            <script>self.__next_f.push([1]);</script>
            """;

        var directive = FrontendScriptPolicy.BuildDirective(indexHtml);

        Assert.Equal(
            "script-src 'self' 'wasm-unsafe-eval' 'sha256-sPbCnNFvTgEr8sWPb+XQrGkBBIvMM1qhSS4P+UiVUeE='",
            directive);
        Assert.DoesNotContain("'unsafe-inline'", directive, StringComparison.Ordinal);
        Assert.DoesNotContain("'unsafe-eval'", directive, StringComparison.Ordinal);
    }
}
