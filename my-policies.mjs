import { customPolicies, allow, deny } from "failproofai";

// One file, no relative imports: only this entry is digest-pinned, so a pack
// that imported siblings could not honestly claim to be verified.

customPolicies.add({
  name: "block-force-push",
  description: "Block git push --force on any branch",
  // Groups it in the picker, and is what --category selects on.
  category: "Git",
  // Whether it is ON for somebody who installs with no flags. Defaults to false.
  defaultEnabled: true,
  match: { events: ["PreToolUse"] },
  fn: async (ctx) => {
    if (ctx.toolName !== "Bash") return allow();
    const cmd = String(ctx.toolInput?.command ?? "");
    if (/\bgit\s+push\b[^|;&]*\s(-f|--force)\b/.test(cmd)) {
      return deny("Force-push rewrites history someone else may have pulled.");
    }
    return allow();
  },
});
