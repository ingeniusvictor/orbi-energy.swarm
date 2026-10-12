# ES-13 Phase Closure Checklist

Use this checklist before declaring any ES-13 phase closed.

- [ ] Issue exists and describes the scoped contract.
- [ ] Branch started from the intended exact canonical SHA.
- [ ] Implementation stayed within declared scope.
- [ ] No forbidden cap/budget/Campaign/asset changes entered accidentally.
- [ ] Required tests were added or updated without weakening guarantees.
- [ ] Repository/gameplay/platform/typecheck/release/build/readiness gates are GREEN as applicable.
- [ ] Temporary certification workflows/instrumentation are removed from final diff.
- [ ] PR CI is GREEN on the exact final PR head SHA.
- [ ] Android PR CI is GREEN when applicable.
- [ ] Squash merge used the expected final PR head SHA.
- [ ] New canonical SHA has the expected parent/tree relationship.
- [ ] Post-merge main CI is GREEN on the exact canonical SHA.
- [ ] Post-merge Android is GREEN on the exact canonical SHA.
- [ ] Pages/Web deployment is GREEN on the exact canonical SHA.
- [ ] Manual/hardware blockers are left open unless real evidence exists.
- [ ] `PROJECT_CONTINUITY.md` updated.
- [ ] `IMPLEMENTATION_LEDGER.md` updated.
- [ ] `ES13_GAMEPLAY_ROADMAP.md` status updated.
- [ ] Next active phase/blocker is explicitly recorded.

If any required item is incomplete, the phase is not administratively closed.