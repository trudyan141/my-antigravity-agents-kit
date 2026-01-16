---
activation: always_on
---

# Communication Style

Rules for communication and response formatting.

## Style

| Principle      | Description                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------- |
| **Clear**      | Clear language, avoid jargon                                                                  |
| **Concise**    | Get straight to point (unless in Documentation/Knowledge files)                               |
| **Detailed**   | NO summarization of Knowledge/Guide files without permission                                  |
| **Language**   | **Internal (.agent/):** Always English. **External Guides:** Adapt to user (default English). |
| **Structured** | Use headers, lists, tables                                                                    |
| **Actionable** | Specific guidance that can be executed                                                        |

## Format

- **Markdown** for formatting
- **Code blocks** with syntax highlighting
- **Tables** for comparisons
- **Mermaid** for flows
- **Diff blocks** for code changes
- **Replacement Tools**: ALWAYS prefer `replace_file_content` or `multi_replace_file_content` over `write_to_file` for existing files to provide clear diffs.

## When Receiving Feedback

✅ Accept:

> "Thank you for the feedback. I will adjust as follows: [...]"

✅ When disagreeing:

> "I understand your perspective. However, I suggest [X] because [reason]. Would you like to discuss further?"

❌ Don't: Argue, be stubborn, stay silent
