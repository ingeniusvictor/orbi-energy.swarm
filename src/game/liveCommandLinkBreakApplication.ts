import { resolveCommandLinkBinding, type CommandLinkFormationFacts } from "./commandLinkBinding";
import type { CommandLinkBreakResolution } from "./commandLinkBreakResolution";

export const shouldDetachCommandLinkMember = (
  resolution: Readonly<CommandLinkBreakResolution> | null | undefined,
  formation: CommandLinkFormationFacts | null | undefined,
): boolean => {
  if (!resolution || !formation) return false;
  if (
    resolution.profileId !== "COMMAND_CORE" ||
    resolution.signal !== "COMMAND_LINK_BROKEN" ||
    resolution.intent !== "DETACH_LINKED_MEMBERS" ||
    resolution.effectMode !== "INTENT_ONLY" ||
    resolution.coreMemberIndex !== 0
  ) {
    return false;
  }

  const binding = resolveCommandLinkBinding(formation);
  if (!binding || binding.memberRole !== "LINKED_MEMBER") return false;
  if (binding.groupId !== resolution.groupId) return false;

  const firstLinkedIndex = resolution.linkedMemberIndices[0];
  const secondLinkedIndex = resolution.linkedMemberIndices[1];
  return (
    binding.memberIndex === firstLinkedIndex ||
    binding.memberIndex === secondLinkedIndex
  );
};
