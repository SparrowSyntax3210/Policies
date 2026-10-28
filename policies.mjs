import { customPolicies, allow, deny } from "failproofai";

customPolicies.add({
  name: "block-force-push-main",
  description: "Blocks Git force pushes that explicitly target the main branch.",
  category: "git-safety",
  defaultEnabled: true,
  match: { events: ["PreToolUse"] },
  fn: async (ctx) => {
    if (ctx.toolName !== "Bash") return allow();

    const command = String(ctx.toolInput?.command ?? "");
    if (!/\bgit\s+push\b/i.test(command)) return allow();

    const forcePush = /(?:^|\s)(?:--force(?:-with-lease(?:=[^\s]+)?(?:\s+[^\s]+)?)?|-f)(?=\s|$)/i.test(command);
    if (!forcePush) return allow();

    // Match the common explicit branch forms: main, refs/heads/main, and
    // source:main refspecs. Keep this rule scoped to commands naming main.
    const targetsMain = /(?:^|[\s=:])(?:refs\/heads\/)?main(?:$|[\s])/i.test(command);
    if (!targetsMain) return allow();

    return deny("Force pushing to main is blocked. Push your work to a feature branch and open a pull request instead.");
  },
});
