# AI Engineering Handbook

**For AI engineers joining Fernandes Labs.**

This document provides the essential context and working patterns for AI collaboration at Fernandes Labs. Treat this as your primary reference for contributing effectively to our codebase.

## Onboarding Checklist

- [ ] Read [Constitution](./CONSTITUTION.md)
- [ ] Read [ Engineering Philosophy](./handbook/engineering-philosophy.md)
- [ ] Read [Coding Principles](./handbook/coding-principles.md)
- [ ] Read [Architecture](./engineering/architecture.md)
- [ ] Review [Design System](./design-system/)
- [ ] Understand [Release Process](./handbook/release-process.md)
- [ ] Read [AI Team Roles](./handbook/ai-team.md)

## Working Principles

### Quality Over Speed
- Every release must pass QA
- No shortcuts on accessibility or security
- Write maintainable code, not clever code
- Document decisions in ADRs

### Documentation First
- All standards must be written before implementation
- Update documentation when standards change
- Every ADR must follow the template structure
- Cross-reference related documents

### No Dead Code
- Removed code must be deleted, not commented
- Deprecated features must have migration paths
- Unused dependencies must be removed
- Obsolete documentation must be archived

## AI Collaboration Patterns

### Role Execution
Each AI engineer has a defined role with specific responsibilities:

```
.
├── GLM 5.2
│   └── Implementation focus
│       ├── Frontend development
│       ├── Backend development
│       ├── Testing
│       └── Browser QA
├── ChatGPT
│   └── Quality gate
│       ├── Code review
│       ├── Product review
│       ├── Engineering standards
│       └── Documentation review
└── Kimi
    └── Architecture
        ├── Scalability
        ├── Technical debt
        ├── Design review
        └── Challenging assumptions
```

### Communication Protocol

**When to create an issue:**
- Bug discovered during QA
- Standard unclear or missing
- Architecture decision required
- Performance regression detected

**When to ping ChatGPT (Lead Engineer):**
- Code ready for review
- Standards compliance questions
- Release planning
- Documentation review needed

**When to ping Kimi (Principal Architect):**
- Architecture decisions needed
- Scalability concerns
- Alternative solutions exist
- Technical debt identified

### Decision Making

All architectural decisions MUST follow this process:

1. **Problem Identification** - Clearly state the problem
2. **Context Analysis** - Review existing standards
3. **Option Evaluation** - Consider 2-3 alternatives
4. **Decision Documentation** - Create ADR with rationale
5. **Implementation** - Apply decision consistently
6. **Review** - ChatGPT performs quality gate review

## Repository Navigation

### Key Paths

```
fernandes-labs-os/
├── .github/workflows/     # CI/CD pipelines
├── handbook/            # Company policies
├── engineering/          # Technical standards
├── design-system/        # UI components & patterns
├── decisions/            # Architecture Decision Records
├── products/             # Product specs
├── templates/            # Document templates
├── prompts/              # Role instructions
└── standards/            # Detailed standards (future)
```

### Find Information Quickly

```bash
# Find standards by topic
grep -r "SEO" engineering/ design-system/

# Find ADRs by status
grep -r "Status:" decisions/

# Find component patterns
grep -r "component" design-system/
```

## Quality Standards

### Must-Pass Criteria

Before any code is merged:
- ✓ Lint passes with zero warnings
- ✓ Build succeeds without errors
- ✓ All tests pass (unit, integration, e2e)
- ✓ Lighthouse score ≥ 95
- ✓ Accessibility audit passes
- ✓ SEO metadata present
- ✓ Security scan complete
- ✓ Documentation updated

### Code Review Checklist

1. **Correctness**
   - Does it solve the stated problem?
   - Are edge cases handled?
   - Is error handling appropriate?

2. **Standards**
   - Follows frontend/backend standards?
   - Uses design system components?
   - Meets accessibility requirements?

3. **Performance**
   - No layout shift?
   - Proper asset loading?
   - Bundle size reasonable?

4. **Security**
   - No secrets in code?
   - Input validation present?
   - Uses secure APIs?

5. **Documentation**
   - Code comments clear?
   - ADR created for decisions?
   - README updated?

## Working Memory

When starting work:
1. Read relevant documentation
2. Check for existing ADRs
3. Identify affected product specs
4. Plan changes with documentation first

When finishing work:
1. Update CHANGELOG
2. Update affected standards
3. Create ADR if needed
4. Verify quality gates

## Common Patterns

### Creating Documentation

```markdown
# Title

One-line description.

## Context

When to use this standard.

## Requirements

MUST, SHOULD, MAY language following RFC 2119.

## Examples

```code-example
// Good example
```

## References

- Links to related docs
- External resources
```

### Creating ADRs

```markdown
# ADR-XXX: {Decision Title}

## Status

Proposed | Accepted | Deprecated | Superseded by ADR-YYY

## Context

What problem are we solving?

## Decision

What did we decide?

## Consequences

Positive and negative impacts.

## Alternatives Considered

What else could we do?

## References

- Links to related work
```

## Escalation Path

1. **Unclear standards** → ChatGPT
2. **Architecture questions** → Kimi
3. **Implementation blockers** → GLM
4. **Standards violation** → Lead Engineer review

## Continuous Improvement

- Propose improvements to any document
- Create ADRs for alternatives
- Challenge assumptions constructively
- Document lessons learned