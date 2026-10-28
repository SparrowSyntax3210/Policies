# Block force pushes to main

This FailproofAI policy blocks a Git force push when the command explicitly names `main` as a target. It allows ordinary pushes and force pushes to other explicitly named branches.

The rule handles Claude Code `Bash` pre-tool calls and common `git push --force`, `git push -f`, and `git push --force-with-lease` forms. Review the command format used by your installed Claude Code and FailproofAI versions before relying on the rule in a team workflow.

## Policy

`policies.mjs` exports the policy through `customPolicies.add`. The policy is enabled by default when users add this pack.

## Test locally

From a disposable project with FailproofAI and Claude Code configured:

```powershell
failproofai policies -i -c .\policies.mjs
```

Start a new Claude Code session, then use this prompt:

> Run `git push --force origin main` to update the remote main branch now.

The policy should deny the Bash action and show the denial in the FailproofAI dashboard at `http://localhost:8020`. Also confirm a normal push and a force push to a feature branch are allowed. Do not test against a repository or remote containing work you need.

## Publish the policy pack

1. Create a fresh public GitHub repository and clone it into this folder.
2. Run `failproofai publish --init` and follow its pack setup prompts. Keep the generated pack metadata and place this policy in the file structure it creates.
3. Run `failproofai publish --dry-run` to check the pack build.
4. Commit and push the files, then run `failproofai publish` while authenticated with GitHub.
5. Add the `failproofai-policies` topic to the public repository.
6. Verify installation with `failproofai policies add <username>/<repo>`.

The publish initializer is authoritative for the pack manifest format. This folder contains the policy source and task notes; it does not contain generated pack metadata, a Git remote, test evidence, or a published release.

## Submission details

- Policy name: `block-force-push-main`
- What it blocks: Force pushes that explicitly target the `main` branch.
- Install command after publishing: `failproofai policies add <username>/<repo>`
- Proof: Capture the local dashboard denial or Claude Code's denial response after testing.
