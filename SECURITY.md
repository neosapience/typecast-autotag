# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it via email to:

**help@typecast.ai**

Please do NOT report security vulnerabilities through public GitHub issues.

### What to Include

Please include the following information in your report:

- Type of vulnerability (for example, injection, unsafe file handling, or dependency vulnerability)
- Affected package, binding, and version
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code, if possible
- Potential impact of the vulnerability

## Security Best Practices

When using Typecast Autotag:

- Keep Typecast Autotag packages updated to the latest version
- Review dependencies regularly for known vulnerabilities
- Validate untrusted input before passing it through text preprocessing pipelines
- Review generated output before sending it to downstream systems in sensitive workflows
